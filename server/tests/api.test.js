import assert from "node:assert/strict";
import { after, before, test } from "node:test";
import { execFileSync } from "node:child_process";
import { mkdtempSync, readdirSync, rmSync, rmdirSync } from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { once } from "node:events";

const serverDirectory = fileURLToPath(new URL("../", import.meta.url));
const testDirectory = mkdtempSync(path.join(tmpdir(), "unishop sqlite test-"));
process.env.DATABASE_URL = `file:${path.join(testDirectory, "test.db")}`;
process.env.JWT_SECRET = "integration-test-secret-not-used-outside-tests";
process.env.NODE_ENV = "test";

let prisma;
let server;
let baseUrl;
let buyer;
let seller;
let admin;
let listing;
let freeListing;
let report;

const request = async (method, route, body, token, expected = 200) => {
  const response = await fetch(`${baseUrl}/api${route}`, {
    method,
    headers: { ...(body ? { "Content-Type": "application/json" } : {}), ...(token ? { Authorization: `Bearer ${token}` } : {}) },
    ...(body ? { body: JSON.stringify(body) } : {}),
  });
  const data = await response.json();
  assert.equal(response.status, expected, `${method} ${route}: ${JSON.stringify(data)}`);
  return data;
};

const payload = (overrides = {}) => ({
  title: "Calculus Textbook", description: "Used mathematics notes", price: 25,
  images: ["https://example.com/book.jpg"], category: "Books & Notes",
  condition: "Good", location: "Campus", whatsapp: "+923001234567",
  ...overrides,
});

before(async () => {
  const options = { cwd: serverDirectory, env: process.env, stdio: "pipe" };
  execFileSync(process.execPath, ["scripts/prepare-database.js"], options);
  execFileSync(process.execPath, ["node_modules/prisma/build/index.js", "migrate", "deploy"], options);
  prisma = (await import("../config/db.js")).default;
  const app = (await import("../app.js")).default;
  server = app.listen(0, "127.0.0.1");
  await once(server, "listening");
  baseUrl = `http://127.0.0.1:${server.address().port}`;
});

after(async () => {
  if (server) await new Promise((resolve, reject) => server.close((error) => error ? reject(error) : resolve()));
  if (prisma) await prisma.$disconnect();
  // Remove only files in the exact temporary directory created by this test.
  for (const file of readdirSync(testDirectory)) rmSync(path.join(testDirectory, file));
  rmdirSync(testDirectory);
});

test("SQLite-backed marketplace API", async (t) => {
  await t.test("registers users, hashes passwords, and preserves the session contract", async () => {
    await request("POST", "/auth/register", { name: "Invalid", email: "bad", password: "123456", university: "UCP" }, null, 400);
    buyer = await request("POST", "/auth/register", {
      name: "Buyer", email: "Buyer@Example.com", password: "buyer-password", university: "UCP", isAdmin: true,
    }, null, 201);
    assert.equal(buyer.email, "buyer@example.com");
    assert.equal(buyer.isAdmin, false);
    assert.equal(buyer.accountType, "regular");
    assert.ok(buyer._id && buyer.token);
    assert.equal(buyer.password, undefined);
    assert.equal(buyer.id, undefined);
    const stored = await prisma.user.findUnique({ where: { id: buyer._id } });
    assert.notEqual(stored.password, "buyer-password");
    assert.ok(stored.password.startsWith("$2"));
    await request("POST", "/auth/register", {
      name: "Duplicate", email: "BUYER@example.com", password: "password", university: "UCP",
    }, null, 400);
    const session = await request("POST", "/auth/login", { email: "BUYER@example.com", password: "buyer-password" });
    assert.equal(session._id, buyer._id);
    assert.equal(session.password, undefined);
    await request("POST", "/auth/login", { email: buyer.email, password: "incorrect" }, null, 401);
    const me = await request("GET", "/auth/me", null, buyer.token);
    assert.deepEqual(me.wishlist, []);
    assert.equal(me.password, undefined);
    await request("GET", "/auth/me", null, "invalid-token", 401);
    await request("GET", "/auth/me", null, null, 401);
  });

  await t.test("enforces seller permissions and validates data formerly checked by Mongoose", async () => {
    await request("POST", "/products", payload(), buyer.token, 403);
    seller = await request("POST", "/auth/register", {
      name: "Seller", email: "seller@example.com", password: "seller-password", university: "FAST",
    }, null, 201);
    const switched = await request("PATCH", "/auth/account-type", { accountType: "seller" }, seller.token);
    assert.equal(switched.accountType, "seller");
    await request("PATCH", "/auth/account-type", { accountType: "admin" }, buyer.token, 400);
    await request("POST", "/products", payload({ category: "Invalid" }), seller.token, 400);
    await request("POST", "/products", payload({ price: -1 }), seller.token, 400);
    await request("POST", "/products", payload({ title: "x".repeat(101) }), seller.token, 400);
    await request("POST", "/products", payload({ images: "invalid" }), seller.token, 400);
    listing = await request("POST", "/products", payload({ sellerId: buyer._id, status: "sold" }), seller.token, 201);
    assert.equal(listing.seller._id, seller._id);
    assert.equal(listing.seller.password, undefined);
    assert.equal(listing.status, "available");
    assert.deepEqual(listing.images, payload().images);
    freeListing = await request("POST", "/products", payload({ title: "Free calculator", description: "A spare device", price: 0 }), seller.token, 201);
    assert.equal(freeListing.price, 0);
  });

  await t.test("supports search, filtering, sorting and bounded pagination", async () => {
    const results = await request("GET", "/products?search=CALCULUS&category=Books%20%26%20Notes&condition=Good");
    assert.equal(results.total, 1);
    assert.equal(results.products[0]._id, listing._id);
    assert.equal(results.products[0].seller.name, "Seller");
    assert.equal((await request("GET", "/products?search=mathematics")).total, 1);
    const page1 = await request("GET", "/products?sort=price_asc&limit=1&page=1");
    assert.equal(page1.products[0]._id, freeListing._id);
    assert.equal(page1.pages, 2);
    const page2 = await request("GET", "/products?sort=price_asc&limit=1&page=2");
    assert.equal(page2.products[0]._id, listing._id);
    assert.equal((await request("GET", "/products?minPrice=0&maxPrice=0")).total, 1);
    await request("GET", "/products?page=-1", null, null, 400);
    await request("GET", "/products?limit=10000", null, null, 400);
    await request("GET", "/products?minPrice=invalid", null, null, 400);
  });

  await t.test("preserves profiles, owner controls, and populated seller data after updates", async () => {
    const detail = await request("GET", `/products/${listing._id}`);
    assert.equal(detail.views, 1);
    assert.equal(detail.seller._id, seller._id);
    await request("PUT", `/products/${listing._id}`, { price: 10 }, buyer.token, 403);
    await request("DELETE", `/products/${listing._id}`, null, buyer.token, 403);
    await request("PATCH", `/products/${listing._id}/sold`, {}, buyer.token, 403);
    await request("PUT", `/products/${listing._id}`, { condition: "Broken" }, seller.token, 400);
    const updated = await request("PUT", `/products/${listing._id}`, { price: 20 }, seller.token);
    assert.equal(updated.price, 20);
    assert.equal(updated.seller._id, seller._id);
    const sold = await request("PATCH", `/products/${listing._id}/sold`, {}, seller.token);
    assert.equal(sold.status, "sold");
    assert.equal(sold.seller._id, seller._id);
    assert.equal((await request("GET", "/products")).total, 1);
    assert.equal((await request("GET", "/products?status=sold")).total, 1);
    const profile = await request("GET", `/users/${seller._id}`);
    assert.equal(profile.email, undefined);
    assert.equal(profile.password, undefined);
    await request("PUT", `/users/${seller._id}`, { name: "Intruder" }, buyer.token, 403);
    const own = await request("PUT", `/users/${buyer._id}`, { name: "Updated Buyer", isAdmin: true }, buyer.token);
    assert.equal(own.name, "Updated Buyer");
    assert.equal(own.isAdmin, false);
    assert.equal((await request("GET", `/users/${seller._id}/listings`)).length, 2);
    await request("GET", "/products/missing", null, null, 404);
    await request("GET", "/users/missing", null, null, 404);
  });

  await t.test("stores relational wishlists with unique membership and JSON image arrays", async () => {
    await request("GET", "/wishlist", null, null, 401);
    const added = await request("POST", `/wishlist/${listing._id}`, {}, buyer.token, 201);
    assert.deepEqual(added.wishlist, [listing._id]);
    await request("POST", `/wishlist/${listing._id}`, {}, buyer.token, 400);
    const items = await request("GET", "/wishlist", null, buyer.token);
    assert.equal(items[0].seller._id, seller._id);
    assert.deepEqual(items[0].images, payload().images);
    const me = await request("GET", "/auth/me", null, buyer.token);
    assert.deepEqual(me.wishlist, [listing._id]);
    await request("DELETE", `/wishlist/${listing._id}`, null, buyer.token);
    assert.deepEqual(await request("GET", "/wishlist", null, buyer.token), []);
    await request("POST", `/wishlist/${listing._id}`, {}, buyer.token, 201);
    await request("POST", "/wishlist/missing", {}, buyer.token, 404);
  });

  await t.test("handles reports and admin moderation with populated relations", async () => {
    report = await request("POST", "/reports", { productId: listing._id, reason: "Suspected scam", description: "Please review" }, buyer.token, 201);
    assert.equal(report.reporter, buyer._id);
    await request("POST", "/reports", { productId: listing._id, reason: "Invalid" }, buyer.token, 400);
    await request("GET", "/admin/stats", null, buyer.token, 403);
    await request("GET", "/reports", null, buyer.token, 403);
    await request("POST", "/admin/admins", { name: "Intruder" }, buyer.token, 403);
    admin = await request("POST", "/auth/register", {
      name: "Admin", email: "admin@example.com", password: "admin-password", university: "UCP",
    }, null, 201);
    // Bootstrap only this isolated test database.
    await prisma.user.update({ where: { id: admin._id }, data: { isAdmin: true } });
    const stats = await request("GET", "/admin/stats", null, admin.token);
    assert.equal(stats.users, 3);
    assert.equal(stats.listings, 1);
    assert.equal(stats.soldListings, 1);
    assert.equal(stats.pendingReports, 1);
    const reports = await request("GET", "/admin/reports?status=pending", null, admin.token);
    assert.equal(reports[0].reporter._id, buyer._id);
    assert.equal(reports[0].product._id, listing._id);
    const reviewed = await request("PATCH", `/admin/reports/${report._id}`, { status: "reviewed" }, admin.token);
    assert.equal(reviewed.product.title, listing.title);
    assert.equal(reviewed.reporter._id, buyer._id);
    const dismissed = await request("PATCH", `/reports/${report._id}`, { status: "dismissed" }, admin.token);
    assert.equal(dismissed.status, "dismissed");
    await request("PATCH", `/reports/${report._id}`, { status: "invalid" }, admin.token, 400);
    const users = await request("GET", "/admin/users?search=SELLER", null, admin.token);
    assert.equal(users.length, 1);
    assert.equal(users[0].password, undefined);
    const products = await request("GET", "/admin/products?status=sold", null, admin.token);
    assert.equal(products[0].seller._id, seller._id);
  });

  await t.test("hashes admin passwords and protects the current admin from deletion", async () => {
    const created = await request("POST", "/admin/admins", {
      name: "Second Admin", email: "second-admin@example.com", password: "second-password",
    }, admin.token, 201);
    assert.equal(created.isAdmin, true);
    assert.equal(created.password, undefined);
    const login = await request("POST", "/auth/login", { email: created.email, password: "second-password" });
    assert.equal(login.isAdmin, true);
    await request("PATCH", "/admin/password", { currentPassword: "wrong", newPassword: "new-password" }, login.token, 400);
    await request("PATCH", "/admin/password", { currentPassword: "second-password", newPassword: "new-password" }, login.token);
    await request("POST", "/auth/login", { email: created.email, password: "second-password" }, null, 401);
    await request("POST", "/auth/login", { email: created.email, password: "new-password" });
    await request("DELETE", `/admin/users/${admin._id}`, null, admin.token, 400);
    await request("DELETE", `/admin/users/${created._id}`, null, admin.token);
    await request("GET", "/auth/me", null, login.token, 401);
  });

  await t.test("persists data across connections and cascades listing and user deletion", async () => {
    const { images, ...withoutImages } = payload({ title: "Default image array" });
    const defaults = await prisma.product.create({ data: { ...withoutImages, sellerId: seller._id } });
    assert.deepEqual(defaults.images, []);
    await prisma.product.delete({ where: { id: defaults.id } });
    await prisma.$disconnect();
    await prisma.$connect();
    assert.equal((await request("GET", "/products?status=sold")).total, 1);
    await request("DELETE", `/products/${listing._id}`, null, seller.token);
    assert.equal(await prisma.report.count({ where: { productId: listing._id } }), 0);
    assert.deepEqual(await request("GET", "/wishlist", null, buyer.token), []);
    const adminDeleted = await request("POST", "/products", payload({ title: "Admin removal" }), seller.token, 201);
    await request("POST", `/wishlist/${adminDeleted._id}`, {}, buyer.token, 201);
    await request("POST", "/reports", { productId: adminDeleted._id, reason: "Spam" }, buyer.token, 201);
    await request("DELETE", `/admin/products/${adminDeleted._id}`, null, admin.token);
    assert.equal(await prisma.report.count(), 0);
    assert.deepEqual(await request("GET", "/wishlist", null, buyer.token), []);
    await request("POST", `/wishlist/${freeListing._id}`, {}, buyer.token, 201);
    await request("POST", "/reports", { productId: freeListing._id, reason: "Spam" }, buyer.token, 201);
    await request("DELETE", `/admin/users/${seller._id}`, null, admin.token);
    assert.equal(await prisma.product.count(), 0);
    assert.equal(await prisma.report.count(), 0);
    assert.equal(await prisma.wishlistItem.count(), 0);
    await request("GET", "/auth/me", null, seller.token, 401);
  });
});
