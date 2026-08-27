import Report from "../models/Report.js";
import Product from "../models/Product.js";

// @desc    Report a listing
// @route   POST /api/reports
// @access  Private
export const createReport = async (req, res, next) => {
  try {
    const { productId, reason, description } = req.body;

    if (!productId || !reason) {
      return res.status(400).json({ message: "Product and reason are required" });
    }

    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    const report = await Report.create({
      reporter: req.user._id,
      product: productId,
      reason,
      description,
    });

    res.status(201).json(report);
  } catch (error) {
    next(error);
  }
};

// @desc    Get all reports (admin review queue)
// @route   GET /api/reports
// @access  Private/Admin
export const getReports = async (req, res, next) => {
  try {
    const { status } = req.query;
    const query = status ? { status } : {};

    const reports = await Report.find(query)
      .populate("reporter", "name email")
      .populate("product", "title status seller")
      .sort({ createdAt: -1 });

    res.json(reports);
  } catch (error) {
    next(error);
  }
};

// @desc    Update a report's status
// @route   PATCH /api/reports/:id
// @access  Private/Admin
export const updateReportStatus = async (req, res, next) => {
  try {
    const { status } = req.body;
    if (!["pending", "reviewed", "dismissed"].includes(status)) {
      return res.status(400).json({ message: "Invalid status" });
    }

    const report = await Report.findById(req.params.id);
    if (!report) {
      return res.status(404).json({ message: "Report not found" });
    }

    report.status = status;
    await report.save();

    res.json(report);
  } catch (error) {
    next(error);
  }
};