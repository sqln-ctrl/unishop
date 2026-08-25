import User from "../models/User.js";
import Product from "../models/Product.js";

// @desc    Get public user profile
// @route   GET /api/users/:id
// @access  Public
export const getUserProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id).select(
      "name university profileImage createdAt"
    );
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json(user);
  } catch (error) {
    next(error);
  }
};

// @desc    Update own profile
// @route   PUT /api/users/:id
// @access  Private
export const updateUserProfile = async (req, res, next) => {
  try {
    if (req.params.id !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not authorized" });
    }

    const user = await User.findById(req.params.id);
    const fields = ["name", "university", "profileImage"];
    fields.forEach((field) => {
      if (req.body[field] !== undefined) user[field] = req.body[field];
    });

    const updated = await user.save();
    res.json({
      _id: updated._id,
      name: updated.name,
      email: updated.email,
      university: updated.university,
      profileImage: updated.profileImage,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get a user's active listings
// @route   GET /api/users/:id/listings
// @access  Public
export const getUserListings = async (req, res, next) => {
  try {
    const listings = await Product.find({ seller: req.params.id }).sort({ createdAt: -1 });
    res.json(listings);
  } catch (error) {
    next(error);
  }
};
