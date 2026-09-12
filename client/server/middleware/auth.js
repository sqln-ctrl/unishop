import jwt from "jsonwebtoken";
import prisma from "../config/db.js";
import { userSelect } from "../utils/serializers.js";
import { getRole } from "../utils/roles.js";

export const protect = async (req, res, next) => {
  const authorization = req.headers.authorization;
  if (!authorization?.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Not authorized, no token" });
  }

  let decoded;
  try {
    decoded = jwt.verify(authorization.slice(7), process.env.JWT_SECRET);
    if (typeof decoded.id !== "string") throw new Error("Invalid token subject");
  } catch {
    return res.status(401).json({ message: "Not authorized, token failed" });
  }

  try {
    req.user = await prisma.user.findUnique({ where: { id: decoded.id }, select: userSelect });
    if (!req.user) return res.status(401).json({ message: "User not found" });
    if ((decoded.tokenVersion ?? 0) !== req.user.tokenVersion) {
      return res.status(401).json({ message: "Session expired. Please log in again." });
    }
    next();
  } catch (error) {
    next(error);
  }
};

export const authorizeRoles = (...allowedRoles) => (req, res, next) => {
  if (!req.user) return res.status(401).json({ message: "Please log in first" });
  if (allowedRoles.includes(getRole(req.user))) return next();
  return res.status(403).json({ message: "Your account does not have permission for this action" });
};

export const admin = authorizeRoles("admin");
export const sellerOnly = authorizeRoles("seller", "admin");
