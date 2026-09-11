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

const router = express.Router();

router.get("/", getProducts);
router.get("/:id", getProductById);
// Photos are uploaded to /api/uploads first; listings contain their hosted URLs.
router.post("/", protect, sellerOnly, createProduct);
router.put("/:id", protect, updateProduct);
router.delete("/:id", protect, deleteProduct);
router.patch("/:id/sold", protect, markAsSold);

export default router;
