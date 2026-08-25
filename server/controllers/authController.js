import User from "../models/User.js";
import generateToken from "../utils/generateToken.js";

// @desc    Register a new student
// @route   POST /api/auth/register
// @access  Public
export const registerUser = async (req, res, next) => {
  try {
    const { name, email, password, university, accountType } = req.body;

    if (!name || !email || !password || !university) {
      return res.status(400).json({ message: "Please fill in all fields" });
    }

    if (accountType && !["regular", "seller"].includes(accountType)) {
      return res.status(400).json({ message: "Invalid account type" });
    }

    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: "Email already registered" });
    }

    const user = await User.create({
      name,
      email,
      password,
      university,
      accountType: accountType || "regular",
    });

    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      university: user.university,
      accountType: user.accountType,
      isAdmin: user.isAdmin,
      isVerified: user.isVerified,
      token: generateToken(user._id),
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Login student
// @route   POST /api/auth/login
// @access  Public
export const loginUser = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Please provide email and password" });
    }

    const user = await User.findOne({ email }).select("+password");

    if (!user || !(await user.matchPassword(password))) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      university: user.university,
      accountType: user.accountType,
      isAdmin: user.isAdmin,
      isVerified: user.isVerified,
      profileImage: user.profileImage,
      token: generateToken(user._id),
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get current logged-in user
// @route   GET /api/auth/me
// @access  Private
export const getMe = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);
    res.json(user);
  } catch (error) {
    next(error);
  }
};

// @desc    Switch between a regular and a seller account
// @route   PATCH /api/auth/account-type
// @access  Private
export const updateAccountType = async (req, res, next) => {
  try {
    const { accountType } = req.body;

    if (!["regular", "seller"].includes(accountType)) {
      return res.status(400).json({ message: "Invalid account type" });
    }

    const user = await User.findById(req.user._id);
    user.accountType = accountType;
    await user.save();

    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      university: user.university,
      accountType: user.accountType,
      isAdmin: user.isAdmin,
      isVerified: user.isVerified,
      profileImage: user.profileImage,
    });
  } catch (error) {
    next(error);
  }
};
