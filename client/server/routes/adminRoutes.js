import express from "express";
import { protect, admin } from "../middleware/auth.js";

import {
  getAdminStats,
  getAdminUsers,
  deleteAdminUser,
  getAdminProducts,
  deleteAdminProduct,
  getAdminReports,
  updateAdminReport,
  createAdmin,
  changeAdminPassword,
} from "../controllers/adminController.js";

const router = express.Router();

router.use(protect, admin);

router.get("/stats", getAdminStats);

router.get("/users", getAdminUsers);
router.delete("/users/:id", deleteAdminUser);

router.get("/products", getAdminProducts);
router.delete("/products/:id", deleteAdminProduct);

router.get("/reports", getAdminReports);
router.patch("/reports/:id", updateAdminReport);

router.post("/admins", createAdmin);

router.patch("/password", changeAdminPassword);

export default router;