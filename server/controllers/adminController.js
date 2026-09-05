import bcrypt from "bcryptjs";
import User from "../models/User.js";
import Product from "../models/Product.js";
import Report from "../models/Report.js";

export const getAdminStats = async (req, res, next) => {
  try {
    const [users, admins, listings, soldListings, pendingReports] =
      await Promise.all([
        User.countDocuments(),
        User.countDocuments({ isAdmin: true }),
        Product.countDocuments({ status: "available" }),
        Product.countDocuments({ status: "sold" }),
        Report.countDocuments({ status: "pending" }),
      ]);

    res.json({
      users,
      admins,
      listings,
      soldListings,
      pendingReports,
    });
  } catch (error) {
    next(error);
  }
};

export const getAdminUsers = async (req, res, next) => {
  try {
    const { search } = req.query;
    const query = {};

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
        { university: { $regex: search, $options: "i" } },
      ];
    }

    const users = await User.find(query)
      .select(
        "name email university accountType isAdmin isVerified createdAt"
      )
      .sort({ createdAt: -1 });

    res.json(users);
  } catch (error) {
    next(error);
  }
};

export const deleteAdminUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (user._id.toString() === req.user._id.toString()) {
      return res
        .status(400)
        .json({ message: "You cannot delete your own admin account" });
    }

    if (user.isAdmin) {
      const adminCount = await User.countDocuments({ isAdmin: true });

      if (adminCount <= 1) {
        return res
          .status(400)
          .json({ message: "You cannot delete the last admin account" });
      }
    }

    const products = await Product.find({
      seller: user._id,
    }).select("_id");

    const productIds = products.map((product) => product._id);

    await Promise.all([
      Product.deleteMany({ seller: user._id }),

      Report.deleteMany({
        $or: [
          { reporter: user._id },
          { product: { $in: productIds } },
        ],
      }),

      User.updateMany(
        {},
        {
          $pull: {
            wishlist: {
              $in: productIds,
            },
          },
        }
      ),

      user.deleteOne(),
    ]);

    res.json({
      message: "User and their listings were deleted",
    });
  } catch (error) {
    next(error);
  }
};

export const getAdminProducts = async (req, res, next) => {
  try {
    const { status } = req.query;

    const query =
      status && ["available", "sold"].includes(status)
        ? { status }
        : {};

    const products = await Product.find(query)
      .populate("seller", "name email university")
      .sort({ createdAt: -1 });

    res.json(products);
  } catch (error) {
    next(error);
  }
};

export const deleteAdminProduct = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        message: "Listing not found",
      });
    }

    await Promise.all([
      product.deleteOne(),

      Report.deleteMany({
        product: product._id,
      }),

      User.updateMany(
        {},
        {
          $pull: {
            wishlist: product._id,
          },
        }
      ),
    ]);

    res.json({
      message: "Listing deleted",
    });
  } catch (error) {
    next(error);
  }
};

export const getAdminReports = async (req, res, next) => {
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

export const updateAdminReport = async (req, res, next) => {
  try {
    const { status } = req.body;

    if (!["pending", "reviewed", "dismissed"].includes(status)) {
      return res.status(400).json({
        message: "Invalid report status",
      });
    }

    const report = await Report.findById(req.params.id);

    if (!report) {
      return res.status(404).json({
        message: "Report not found",
      });
    }

    report.status = status;

    await report.save();

    res.json(report);
  } catch (error) {
    next(error);
  }
};

export const createAdmin = async (req, res, next) => {
  try {
    const {
      name,
      email,
      password,
      university,
    } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        message: "Name, email and password are required",
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        message: "Password must be at least 6 characters",
      });
    }

    const normalizedEmail = email.trim().toLowerCase();

    const existingUser = await User.findOne({
      email: normalizedEmail,
    });

    if (existingUser) {
      return res.status(400).json({
        message: "A user with this email already exists",
      });
    }

    const adminUser = await User.create({
      name: name.trim(),
      email: normalizedEmail,
      password,
      university:
        university?.trim() || "UniShop Administration",
      accountType: "regular",
      isAdmin: true,
      isVerified: true,
    });

    res.status(201).json({
      _id: adminUser._id,
      name: adminUser.name,
      email: adminUser.email,
      university: adminUser.university,
      isAdmin: adminUser.isAdmin,
      isVerified: adminUser.isVerified,
    });
  } catch (error) {
    next(error);
  }
};

export const changeAdminPassword = async (req, res, next) => {
  try {
    const {
      currentPassword,
      newPassword,
    } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({
        message: "Current and new passwords are required",
      });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({
        message: "New password must be at least 6 characters",
      });
    }

    const user = await User.findById(req.user._id).select("+password");

    if (!user) {
      return res.status(404).json({
        message: "Admin account not found",
      });
    }

    const matches = await bcrypt.compare(
      currentPassword,
      user.password
    );

    if (!matches) {
      return res.status(400).json({
        message: "Current password is incorrect",
      });
    }

    user.password = newPassword;

    await user.save();

    res.json({
      message: "Password changed successfully",
    });
  } catch (error) {
    next(error);
  }
};