import assert from "node:assert/strict";
import { before, after, beforeEach, test } from "node:test";
import bcrypt from "bcryptjs";

// These tests use an in-memory database substitute, never the configured Supabase.
process.env.DATABASE_URL = "postgresql://test:test@127.0.0.1:5432/test";
process.env.JWT_SECRET = "isolated-test-signing-secret";
process.env.NODE_ENV = "test";
const { default: prisma } = await import("../config/db.js");
const { default: app } = await import("../app.js");
const { default: generateToken } = await import("../utils/generateToken.js");
const { bootstrapAdmin } = await import("../utils/bootstrapAdmin.js");

const password = "test-password-12345";
const hash = await bcrypt.hash(password, 4);
let server, origin, users;
before(async () => {
  server = app.listen(0, "127.0.0.1");
  await new Promise((resolve) => server.once("listening", resolve));
  origin = `http://127.0.0.1:${server.address().port}`;
});
after(async () => {
  await new Promise((resolve) => server.close(resolve));
  await prisma.$disconnect();
});

const matches = (user, where) => Object.entries(where).every(([key, value]) => user[key] === value);
beforeEach((t) => {
  // Prisma delegates are proxies, so install and restore methods explicitly.
  const stub = (target, method, implementation) => {
    const original = target[method];
    target[method] = implementation;
    t.after(() => { target[method] = original; });
  };
  users = ["regular", "seller", "admin"].map((role) => ({
    id: role, name: role, email: `${role}@test.local`, password: hash,
    university: "Test University", accountType: role === "seller" ? "seller" : "regular",
    isAdmin: role === "admin", isVerified: false, tokenVersion: 0,
  }));
  stub(prisma.user, "findUnique", async ({ where }) => structuredClone(users.find((u) => matches(u, where)) || null));
  stub(prisma.user, "findUniqueOrThrow", async ({ where }) => {
    const user = users.find((u) => matches(u, where));
    if (!user) throw Object.assign(new Error("Missing user"), { code: "P2025" });
    return structuredClone(user);
  });
  stub(prisma.user, "count", async ({ where = {} } = {}) => users.filter((u) => matches(u, where)).length);
  stub(prisma.user, "create", async ({ data }) => {
    if (users.some((u) => u.email === data.email)) throw Object.assign(new Error("Duplicate"), { code: "P2002" });
    const user = { id: `user-${users.length}`, accountType: "regular", isAdmin: false, tokenVersion: 0, ...data };
    users.push(user);
    return structuredClone(user);
  });
  stub(prisma.user, "update", async ({ where, data }) => {
    const user = users.find((u) => matches(u, where));
    if (!user) throw Object.assign(new Error("Missing user"), { code: "P2025" });
    if (data.email && users.some((u) => u.id !== user.id && u.email === data.email)) throw Object.assign(new Error("Duplicate"), { code: "P2002" });
    const { tokenVersion, ...fields } = data;
    Object.assign(user, fields);
    if (tokenVersion) user.tokenVersion += tokenVersion.increment;
    return structuredClone(user);
  });
  stub(prisma.user, "delete", async ({ where }) => { users = users.filter((u) => u.id !== where.id); });
  stub(prisma.product, "count", async () => 0);
  stub(prisma.report, "count", async () => 0);
  stub(prisma.product, "findUnique", async () => ({ id: "listing", sellerId: "another-seller" }));
  stub(prisma, "$transaction", async (operation) => typeof operation === "function" ? operation(prisma) : Promise.all(operation));
});

async function request(path, { role, token, method = "GET", body } = {}) {
  const response = await fetch(`${origin}/api${path}`, {
    method,
    headers: {
      "Content-Type": "application/json",
      ...(token || role ? { Authorization: `Bearer ${token || generateToken(role)}` } : {}),
    },
    ...(body && method !== "GET" ? { body: JSON.stringify(body) } : {}),
  });
  return { status: response.status, data: await response.json() };
}

test("admin routes reject anonymous, regular and seller accounts", async () => {
  const routes = [
    ["/admin/stats", "GET"], ["/admin/users", "GET"], ["/admin/users/seller", "DELETE"],
    ["/admin/users/seller/role", "PATCH"], ["/admin/products", "GET"],
    ["/admin/products/listing", "DELETE"], ["/admin/reports", "GET"],
    ["/admin/reports/report", "PATCH"], ["/admin/admins", "POST"],
    ["/admin/account", "PATCH"], ["/admin/password", "PATCH"],
    ["/reports", "GET"], ["/reports/report", "PATCH"],
  ];
  for (const [path, method] of routes) {
    for (const role of [undefined, "regular", "seller"]) {
      assert.equal((await request(path, { role, method, body: {} })).status, role ? 403 : 401, `${method} ${path}: ${role}`);
    }
  }
  assert.equal((await request("/admin/stats", { role: "admin" })).status, 200);
});

test("regular accounts cannot upload or mutate listings; sellers must own the listing", async () => {
  for (const [path, method] of [["/uploads", "POST"], ["/products", "POST"], ["/products/listing", "PUT"], ["/products/listing", "DELETE"], ["/products/listing/sold", "PATCH"]]) {
    assert.equal((await request(path, { method, role: "regular", body: {} })).status, 403);
  }
  assert.equal((await request("/products/listing", { method: "PUT", role: "seller", body: {} })).status, 403);
});

test("registration, profile editing and account switching cannot grant admin", async () => {
  const registered = await request("/auth/register", { method: "POST", body: {
    name: "Student", email: "new@test.local", password, university: "Test", role: "admin", isAdmin: true,
  } });
  assert.equal(registered.status, 201);
  assert.equal(registered.data.role, "regular");
  assert.equal(registered.data.isAdmin, false);
  assert.equal(registered.data.password, undefined);
  assert.equal(registered.data.tokenVersion, undefined);
  assert.equal((await request("/auth/account-type", { method: "PATCH", role: "regular", body: { accountType: "admin" } })).status, 400);
  const profile = await request("/users/regular", { method: "PUT", role: "regular", body: { name: "Updated", isAdmin: true, role: "admin" } });
  assert.equal(profile.status, 200);
  assert.equal(profile.data.isAdmin, false);
  const switched = await request("/auth/account-type", { method: "PATCH", role: "regular", body: { accountType: "seller", isAdmin: true } });
  assert.equal(switched.data.role, "seller");
  assert.equal(switched.data.isAdmin, false);
});

test("admin role changes revoke old sessions and cannot change the caller's role", async () => {
  assert.equal((await request("/admin/users/admin/role", { method: "PATCH", role: "admin", body: { role: "regular" } })).status, 400);
  assert.equal((await request("/admin/users/admin", { method: "DELETE", role: "admin" })).status, 400);
  assert.equal((await request("/admin/users/regular/role", { method: "PATCH", role: "admin", body: { role: "superadmin" } })).status, 400);
  const promoted = await request("/admin/users/regular/role", { method: "PATCH", role: "admin", body: { role: "admin" } });
  assert.equal(promoted.data.role, "admin");
  assert.equal((await request("/admin/stats", { role: "regular" })).status, 401);
  const login = await request("/auth/login", { method: "POST", body: { email: "regular@test.local", password } });
  assert.equal((await request("/admin/stats", { token: login.data.token })).status, 200);
  await request("/admin/users/regular/role", { method: "PATCH", role: "admin", body: { role: "regular" } });
  assert.equal((await request("/admin/stats", { token: login.data.token })).status, 401);
  const fresh = await request("/auth/login", { method: "POST", body: { email: "regular@test.local", password } });
  assert.equal((await request("/admin/stats", { token: fresh.data.token })).status, 403);
});

test("credential changes verify current password, rotate sessions and survive bootstrap", async () => {
  const change = { email: "changed@test.local", currentPassword: "incorrect", newPassword: "changed-password-123" };
  assert.equal((await request("/admin/account", { method: "PATCH", role: "admin", body: change })).status, 400);
  change.currentPassword = password;
  const result = await request("/admin/account", { method: "PATCH", role: "admin", body: change });
  assert.equal(result.status, 200);
  assert.equal(result.data.user.email, change.email);
  assert.equal(result.data.user.password, undefined);
  assert.equal((await request("/admin/stats", { role: "admin" })).status, 401);
  assert.equal((await request("/admin/stats", { token: result.data.user.token })).status, 200);
  assert.equal((await request("/auth/login", { method: "POST", body: { email: change.email, password } })).status, 401);
  assert.equal((await request("/auth/login", { method: "POST", body: { email: change.email, password: change.newPassword } })).status, 200);
  const before = structuredClone(users);
  await bootstrapAdmin(prisma, { ADMIN_EMAIL: "admin@test.local", ADMIN_PASSWORD: password });
  assert.deepEqual(users, before);
});

test("bootstrap hashes credentials, is repeatable, and refuses to promote existing users", async () => {
  users = users.filter((u) => !u.isAdmin);
  await assert.rejects(bootstrapAdmin(prisma, { ADMIN_EMAIL: "regular@test.local", ADMIN_PASSWORD: password }), /existing non-admin/);
  await assert.rejects(bootstrapAdmin(prisma, { ADMIN_EMAIL: "first@test.local", ADMIN_PASSWORD: "short" }), /12 characters/);
  await bootstrapAdmin(prisma, { ADMIN_EMAIL: "first@test.local", ADMIN_PASSWORD: password });
  const admin = users.find((u) => u.isAdmin);
  assert.equal(admin.email, "first@test.local");
  assert.notEqual(admin.password, password);
  assert.ok(await bcrypt.compare(password, admin.password));
  await bootstrapAdmin(prisma, { ADMIN_EMAIL: "other@test.local", ADMIN_PASSWORD: password });
  assert.equal(users.filter((u) => u.isAdmin).length, 1);
});
