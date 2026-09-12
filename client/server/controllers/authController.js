import bcrypt from "bcryptjs";
import prisma from "../config/db.js";
import generateToken from "../utils/generateToken.js";
import { serializeUser, userSelect } from "../utils/serializers.js";
import { emailField, enumField, httpError, passwordField, textField } from "../utils/validation.js";

export const registerUser = async (req, res, next) => {
  try {
    const name = textField(req.body.name, "Name");
    const email = emailField(req.body.email);
    const university = textField(req.body.university, "University");
    const password = passwordField(req.body.password);
    const accountType = enumField(req.body.accountType ?? "regular", ["regular", "seller"], "account type");
    if (await prisma.user.findUnique({ where: { email } })) {
      throw httpError(400, "Email already registered");
    }
    const user = await prisma.user.create({
      data: { name, email, university, accountType, password: await bcrypt.hash(password, 10) },
      select: userSelect,
    });
    res.status(201).json({ ...serializeUser(user), token: generateToken(user.id, user.tokenVersion) });
  } catch (error) {
    next(error);
  }
};

export const loginUser = async (req, res, next) => {
  try {
    const email = emailField(req.body.email);
    if (typeof req.body.password !== "string" || !req.body.password) {
      throw httpError(400, "Please provide email and password");
    }
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user || !(await bcrypt.compare(req.body.password, user.password))) {
      throw httpError(401, "Invalid email or password");
    }
    res.json({ ...serializeUser(user), token: generateToken(user.id, user.tokenVersion) });
  } catch (error) {
    next(error);
  }
};

export const getMe = async (req, res, next) => {
  try {
    const user = await prisma.user.findUniqueOrThrow({
      where: { id: req.user.id },
      select: { ...userSelect, wishlist: { select: { productId: true } } },
    });
    res.json(serializeUser(user));
  } catch (error) {
    next(error);
  }
};

export const updateAccountType = async (req, res, next) => {
  try {
    const accountType = enumField(req.body.accountType, ["regular", "seller"], "account type");
    const user = await prisma.user.update({
      where: { id: req.user.id }, data: { accountType }, select: userSelect,
    });
    res.json(serializeUser(user));
  } catch (error) {
    next(error);
  }
};
