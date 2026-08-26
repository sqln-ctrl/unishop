import express from "express";
import {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  markAsSold,
} from "../controllers/productController.js";
import { protect, sellerOnly } from "../middleware/auth.js";
import { uploadProductImages } from "../middleware/upload.js";

const router = express.Router();

router.get("/", getProducts);
router.get("/:id", getProductById);
router.post("/", protect, sellerOnly, (req, res, next) => {
  uploadProductImages(req, res, (err) => {
    if (err) return next(err);
    next();
  });
}, createProduct);
router.put("/:id", protect, updateProduct);
router.delete("/:id", protect, deleteProduct);
router.patch("/:id/sold", protect, markAsSold);

export default router;
