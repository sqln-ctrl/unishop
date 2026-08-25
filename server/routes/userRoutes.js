import express from "express";
import {
  getUserProfile,
  updateUserProfile,
  getUserListings,
} from "../controllers/userController.js";
import { protect } from "../middleware/auth.js";

const router = express.Router();

router.get("/:id", getUserProfile);
router.put("/:id", protect, updateUserProfile);
router.get("/:id/listings", getUserListings);

export default router;
