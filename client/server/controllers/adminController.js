import bcrypt from "bcryptjs";
import prisma from "../config/db.js";
import { serializeProduct, serializeUser, userSelect } from "../utils/serializers.js";
import { adminPasswordField, emailField, enumField, httpError, textField } from "../utils/validation.js";
import { getRole, roleData, roles } from "../utils/roles.js";
import generateToken from "../utils/generateToken.js";

export { getReports as getAdminReports, updateReportStatus as updateAdminReport } from "./reportController.js";

export const getAdminStats = async (req, res, next) => {
  try {
    const [users, admins, listings, soldListings, pendingReports] = await prisma.$transaction([
      prisma.user.count(),
      prisma.user.count({ where: { isAdmin: true } }),
      prisma.product.count({ where: { status: "available" } }),
      prisma.product.count({ where: { status: "sold" } }),
      prisma.report.count({ where: { status: "pending" } }),
    ]);
    res.json({ users, admins, listings, soldListings, pendingReports });
  } catch (error) {
    next(error);
  }
};

export const getAdminUsers = async (req, res, next) => {
  try {
    const search = req.query.search ? textField(req.query.search, "Search") : "";
    const where = search ? {
      OR: ["name", "email", "university"].map((field) => ({ [field]: { contains: search } })),
    } : {};
    const users = await prisma.user.findMany({
      where, select: userSelect, orderBy: { createdAt: "desc" },
    });
    res.json(users.map(serializeUser));
  } catch (error) {
    next(error);
  }
};

export const deleteAdminUser = async (req, res, next) => {
  try {
    await prisma.$transaction(async (tx) => {
      const actor = await tx.user.findUnique({ where: { id: req.user.id } });
      if (!actor?.isAdmin) throw httpError(403, "Admin access is required");
      const user = await tx.user.findUnique({ where: { id: req.params.id } });
      if (!user) throw httpError(404, "User not found");
      if (user.id === req.user.id) throw httpError(400, "You cannot delete your own admin account");
      if (user.isAdmin && await tx.user.count({ where: { isAdmin: true } }) <= 1) {
        throw httpError(400, "You cannot delete the last admin account");
      }
      // Database foreign keys cascade the user's products, reports, and related wishlist rows.
      await tx.user.delete({ where: { id: user.id } });
    }, { isolationLevel: "Serializable" });
    res.json({ message: "User and their listings were deleted" });
  } catch (error) {
    next(error);
  }
};

export const getAdminProducts = async (req, res, next) => {
  try {
    const where = req.query.status ? { status: enumField(req.query.status, ["available", "sold"], "status") } : {};
    const products = await prisma.product.findMany({
      where,
      include: { seller: { select: { id: true, name: true, email: true, university: true } } },
      orderBy: { createdAt: "desc" },
    });
    res.json(products.map(serializeProduct));
  } catch (error) {
    next(error);
  }
};

export const deleteAdminProduct = async (req, res, next) => {
  try {
    await prisma.product.delete({ where: { id: req.params.id } });
    res.json({ message: "Listing deleted" });
  } catch (error) {
    next(error);
  }
};

export const createAdmin = async (req, res, next) => {
  try {
    const name = textField(req.body.name, "Name");
    const email = emailField(req.body.email);
    const password = adminPasswordField(req.body.password);
    const university = textField(req.body.university, "University", { optional: true }) || "UniShop Administration";
    if (await prisma.user.findUnique({ where: { email } })) {
      throw httpError(400, "A user with this email already exists");
    }
    const user = await prisma.user.create({
      data: {
        name, email, university, password: await bcrypt.hash(password, 10),
        isAdmin: true, isVerified: true,
      },
      select: userSelect,
    });
    res.status(201).json(serializeUser(user));
  } catch (error) {
    next(error);
  }
};

export const changeAdminPassword = async (req, res, next) => {
  if (!req.body.newPassword) return next(httpError(400, "New password is required"));
  return updateAdminCredentials(req, res, next);
};

export const updateAdminCredentials = async (req, res, next) => {
  try {
    if (typeof req.body.currentPassword !== "string" || !req.body.currentPassword) {
      throw httpError(400, "Current password is required");
    }
    const user = await prisma.user.findUniqueOrThrow({ where: { id: req.user.id } });
    if (!(await bcrypt.compare(req.body.currentPassword, user.password))) {
      throw httpError(400, "Current password is incorrect");
    }
    const data = {};
    if (req.body.email !== undefined) data.email = emailField(req.body.email);
    if (req.body.newPassword) data.password = await bcrypt.hash(adminPasswordField(req.body.newPassword), 10);
    if (!Object.keys(data).length) throw httpError(400, "Provide a new email or password");
    const updated = await prisma.user.update({
      where: { id: user.id, isAdmin: true, tokenVersion: user.tokenVersion },
      data: { ...data, tokenVersion: { increment: 1 } }, select: userSelect,
    });
    res.json({
      message: "Admin credentials updated. Other sessions have been signed out.",
      user: { ...serializeUser(updated), token: generateToken(updated.id, updated.tokenVersion) },
    });
  } catch (error) {
    next(error);
  }
};

export const updateUserRole = async (req, res, next) => {
  try {
    const role = enumField(req.body.role, roles, "role");
    if (req.params.id === req.user.id) throw httpError(400, "You cannot change your own admin role");
    const updated = await prisma.$transaction(async (tx) => {
      const actor = await tx.user.findUnique({ where: { id: req.user.id } });
      if (!actor?.isAdmin) throw httpError(403, "Admin access is required");
      const target = await tx.user.findUnique({ where: { id: req.params.id } });
      if (!target) throw httpError(404, "User not found");
      if (getRole(target) === role) return target;
      if (target.isAdmin && role !== "admin" && await tx.user.count({ where: { isAdmin: true } }) <= 1) {
        throw httpError(400, "You cannot remove the last admin");
      }
      return tx.user.update({
        where: { id: target.id },
        data: { ...roleData(role), tokenVersion: { increment: 1 } }, select: userSelect,
      });
    }, { isolationLevel: "Serializable" });
    res.json(serializeUser(updated));
  } catch (error) {
    next(error);
  }
};
