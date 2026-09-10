import prisma from "../config/db.js";
import { serializeProduct, sellerSelect } from "../utils/serializers.js";
import { httpError, productData, productQuery } from "../utils/validation.js";

const sellerInclude = { seller: { select: sellerSelect } };

export const getProducts = async (req, res, next) => {
  try {
    const { where, orderBy, page, limit } = productQuery(req.query);
    const [products, total] = await prisma.$transaction([
      prisma.product.findMany({ where, include: sellerInclude, orderBy, skip: (page - 1) * limit, take: limit }),
      prisma.product.count({ where }),
    ]);
    res.json({ products: products.map(serializeProduct), page, pages: Math.ceil(total / limit), total });
  } catch (error) {
    next(error);
  }
};

export const getProductById = async (req, res, next) => {
  try {
    // Atomic increment avoids losing views when two requests arrive together.
    const product = await prisma.product.update({
      where: { id: req.params.id },
      data: { views: { increment: 1 } },
      include: { seller: { select: { ...sellerSelect, email: true } } },
    });
    res.json(serializeProduct(product));
  } catch (error) {
    next(error);
  }
};

export const createProduct = async (req, res, next) => {
  try {
    const data = productData(req.body);
    const product = await prisma.product.create({
      data: { ...data, sellerId: req.user.id }, include: sellerInclude,
    });
    res.status(201).json(serializeProduct(product));
  } catch (error) {
    next(error);
  }
};

const ownedProduct = async (id, userId) => {
  const product = await prisma.product.findUnique({ where: { id } });
  if (!product) throw httpError(404, "Product not found");
  if (product.sellerId !== userId) throw httpError(403, "Not authorized to modify this listing");
  return product;
};

export const updateProduct = async (req, res, next) => {
  try {
    await ownedProduct(req.params.id, req.user.id);
    const product = await prisma.product.update({
      where: { id: req.params.id },
      data: productData(req.body, true),
      include: sellerInclude,
    });
    res.json(serializeProduct(product));
  } catch (error) {
    next(error);
  }
};

export const deleteProduct = async (req, res, next) => {
  try {
    await ownedProduct(req.params.id, req.user.id);
    // Foreign keys also remove this product's reports and wishlist entries.
    await prisma.product.delete({ where: { id: req.params.id } });
    res.json({ message: "Listing removed" });
  } catch (error) {
    next(error);
  }
};

export const markAsSold = async (req, res, next) => {
  try {
    await ownedProduct(req.params.id, req.user.id);
    const product = await prisma.product.update({
      where: { id: req.params.id }, data: { status: "sold" }, include: sellerInclude,
    });
    res.json(serializeProduct(product));
  } catch (error) {
    next(error);
  }
};
