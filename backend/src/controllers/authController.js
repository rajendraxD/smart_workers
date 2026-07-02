import UserModel from "../models/UserModel.js";
import { emailTemplates } from "../services/emailService.js";
import { notify } from "../services/notificationService.js";
import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";

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

  return res.status(201).json({ message: "Registration successful" });
});

export const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const user = UserModel.findOne({ email });
  console.log(`user: ${user}`);

  if (!user) {
    throw ApiError.unauthorized("Invalid email or password");
  }

  notify({
    userId: user._id,
    event: "LOGIN",
    title: "Login",
    message: "User logged in",
  });
  return res.status(200).json({ message: "Login successful" });
});
