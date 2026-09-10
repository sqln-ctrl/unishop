import prisma from "../config/db.js";
import { serializeUser, serializeProduct, userSelect } from "../utils/serializers.js";
import { httpError, textField } from "../utils/validation.js";

export const getUserProfile = async (req, res, next) => {
  try {
    const user = await prisma.user.findUniqueOrThrow({
      where: { id: req.params.id },
      select: { id: true, name: true, university: true, profileImage: true, createdAt: true },
    });
    res.json(serializeUser(user));
  } catch (error) {
    next(error);
  }
};

export const updateUserProfile = async (req, res, next) => {
  try {
    if (req.params.id !== req.user.id) throw httpError(403, "Not authorized");
    const data = {};
    for (const field of ["name", "university", "profileImage"]) {
      if (req.body[field] !== undefined) {
        data[field] = textField(req.body[field], field, { optional: field === "profileImage" });
      }
    }
    const user = await prisma.user.update({
      where: { id: req.user.id }, data, select: userSelect,
    });
    res.json(serializeUser(user));
  } catch (error) {
    next(error);
  }
};

export const getUserListings = async (req, res, next) => {
  try {
    const products = await prisma.product.findMany({
      where: { sellerId: req.params.id }, orderBy: { createdAt: "desc" },
    });
    res.json(products.map(serializeProduct));
  } catch (error) {
    next(error);
  }
};
