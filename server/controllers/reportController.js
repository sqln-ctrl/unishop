import prisma from "../config/db.js";
import { serializeReport } from "../utils/serializers.js";
import { enumField, httpError, reportReasons, reportStatuses, textField } from "../utils/validation.js";

export const reportInclude = {
  reporter: { select: { id: true, name: true, email: true } },
  product: { select: { id: true, title: true, status: true, sellerId: true } },
};

export const createReport = async (req, res, next) => {
  try {
    const productId = textField(req.body.productId, "Product");
    const reason = enumField(req.body.reason, reportReasons, "report reason");
    const description = textField(req.body.description, "Description", { optional: true, max: 1000 });
    if (!(await prisma.product.findUnique({ where: { id: productId }, select: { id: true } }))) {
      throw httpError(404, "Product not found");
    }
    const report = await prisma.report.create({
      data: { productId, reporterId: req.user.id, reason, description },
    });
    res.status(201).json(serializeReport(report));
  } catch (error) {
    next(error);
  }
};

export const getReports = async (req, res, next) => {
  try {
    const where = req.query.status ? { status: enumField(req.query.status, reportStatuses, "report status") } : {};
    const reports = await prisma.report.findMany({ where, include: reportInclude, orderBy: { createdAt: "desc" } });
    res.json(reports.map(serializeReport));
  } catch (error) {
    next(error);
  }
};

export const updateReportStatus = async (req, res, next) => {
  try {
    const status = enumField(req.body.status, reportStatuses, "report status");
    const report = await prisma.report.update({
      where: { id: req.params.id }, data: { status }, include: reportInclude,
    });
    res.json(serializeReport(report));
  } catch (error) {
    next(error);
  }
};
