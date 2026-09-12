import express from "express";
import { uploadImages } from "../controllers/uploadController.js";
import { protect, sellerOnly } from "../middleware/auth.js";
import upload from "../middleware/upload.js";

const router = express.Router();

router.post("/", protect, sellerOnly, upload.array("images", 5), uploadImages);

export default router;
