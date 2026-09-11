import prisma from "../config/db.js";
import { serializeProduct, sellerSelect } from "../utils/serializers.js";
import { httpError } from "../utils/validation.js";

const wishlistIds = async (userId) => {
  const items = await prisma.wishlistItem.findMany({
    where: { userId }, select: { productId: true }, orderBy: { createdAt: "asc" },
  });
  return items.map((item) => item.productId);
};

export const getWishlist = async (req, res, next) => {
  try {
    const items = await prisma.wishlistItem.findMany({
      where: { userId: req.user.id },
      include: { product: { include: { seller: { select: sellerSelect } } } },
      orderBy: { createdAt: "asc" },
    });
    res.json(items.map((item) => serializeProduct(item.product)));
  } catch (error) {
    next(error);
  }
};

export const addToWishlist = async (req, res, next) => {
  try {
    const product = await prisma.product.findUnique({ where: { id: req.params.productId }, select: { id: true } });
    if (!product) throw httpError(404, "Product not found");
    await prisma.wishlistItem.create({
      data: { userId: req.user.id, productId: product.id },
    });
    res.status(201).json({ message: "Added to wishlist", wishlist: await wishlistIds(req.user.id) });
  } catch (error) {
    next(error.code === "P2002" ? httpError(400, "Already in wishlist") : error);
  }
};

export const removeFromWishlist = async (req, res, next) => {
  try {
    await prisma.wishlistItem.deleteMany({
      where: { userId: req.user.id, productId: req.params.productId },
    });
    res.json({ message: "Removed from wishlist", wishlist: await wishlistIds(req.user.id) });
  } catch (error) {
    next(error);
  }
};
