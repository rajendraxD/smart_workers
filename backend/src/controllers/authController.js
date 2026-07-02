import { logger } from "../config/logger.js";
import UserModel from "../models/UserModel.js";
import { emailTemplates } from "../services/emailService.js";
import { notify } from "../services/notificationService.js";
import { ApiError } from "../utils/ApiError.js";
import { sendSuccess } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { generateToken } from "../utils/token.js";

export const register = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;

  const existingUser = await UserModel.findOne({ email });
  if (existingUser) {
    throw ApiError.conflict("Email already registered");
  }

  const user = await UserModel.create({ name, email, password });

  notify({
    userId: user._id,
    event: "REGISTRATION",
    title: "Registration",
    message: "User registered",
    email: {
      to: user.email,
      ...emailTemplates.welcome(user.name),
    },
  });

  generateToken(user, 201, "Register successful", res);
});

export const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const user = await UserModel.findOne({ email });
  if (!user) {
    throw ApiError.badRequest("Invalid email or password");
  }

  const isMatch = await user.comparePassword(password);
  if (!isMatch) {
    throw ApiError.badRequest("Invalid email or password");
  }

  notify({
    userId: user._id,
    event: "LOGIN",
    title: "Login",
    message: "User logged in",
    email: {
      to: user.email,
      ...emailTemplates.login(user.name),
    },
  });
  generateToken(user, 200, "Login successful", res);
});

export const logout = asyncHandler(async (req, res, next) => {
  res
    .cookie("accessToken", "", {
      maxAge: 0,
      httpOnly: true,
      secure: true,
      sameSite: "none",
    })
    .cookie("refreshToken", "", {
      maxAge: 0,
      httpOnly: true,
      secure: true,
      sameSite: "none",
    });
  return sendSuccess(res, { message: "User logged out successfully" });
});
