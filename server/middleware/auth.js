import jwt from "jsonwebtoken";
import prisma from "../config/db.js";
import { userSelect } from "../utils/serializers.js";

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
    next();
  } catch (error) {
    next(error);
  }
};

export const admin = (req, res, next) => {
  if (req.user?.isAdmin) return next();
  return res.status(403).json({ message: "Not authorized as admin" });
};

export const sellerOnly = (req, res, next) => {
  if (req.user && (req.user.accountType === "seller" || req.user.isAdmin)) return next();
  return res.status(403).json({
    message: "Only seller accounts can do this. Switch to a seller account first.",
  });
};
