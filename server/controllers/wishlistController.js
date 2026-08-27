import User from "../models/User.js";
import Product from "../models/Product.js";

// @desc    Get the logged-in user's wishlist
// @route   GET /api/wishlist
// @access  Private
export const getWishlist = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id).populate({
      path: "wishlist",
      populate: { path: "seller", select: "name university" },
    });
    res.json(user.wishlist);
  } catch (error) {
    next(error);
  }
};

// @desc    Add a product to the wishlist
// @route   POST /api/wishlist/:productId
// @access  Private
export const addToWishlist = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.productId);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    const user = await User.findById(req.user._id);

    if (user.wishlist.some((id) => id.toString() === req.params.productId)) {
      return res.status(400).json({ message: "Already in wishlist" });
    }

    user.wishlist.push(product._id);
    await user.save();

    res.status(201).json({ message: "Added to wishlist", wishlist: user.wishlist });
  } catch (error) {
    next(error);
  }
};

// @desc    Remove a product from the wishlist
// @route   DELETE /api/wishlist/:productId
// @access  Private
export const removeFromWishlist = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);

    user.wishlist = user.wishlist.filter(
      (id) => id.toString() !== req.params.productId
    );
    await user.save();

    res.json({ message: "Removed from wishlist", wishlist: user.wishlist });
  } catch (error) {
    next(error);
  }
};