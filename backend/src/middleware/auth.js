import { logger } from "../config/logger.js";
import UserModel from "../models/UserModel.js";
import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const isAuthenticate = asyncHandler(async (req, _res, next) => {
  const { accessToken, refreshToken } = req.cookies;

  if (!accessToken) {
    logger.warn("Access token missing");
    throw ApiError.unauthorized("Session expired. Please login to continue.");
  }
  if (!refreshToken) {
    logger.warn("Refresh token missing");
    throw ApiError.unauthorized("Session expired. Please login to continue.");
  }

  const decodedAccessToken = await UserModel.decodeAccessToken(accessToken);
  if (!decodedAccessToken) {
    logger.warn("Access token is not valid");
    throw ApiError.unauthorized("Access token is not valid");
  }

  req.user = await UserModel.findById(decodedAccessToken.id);
  if (!req.user) {
    logger.warn("User not found with this token id.");
    throw ApiError.unauthorized("User not found with this token id.");
  }

  // Remove password from user object
  req.user = req.user.toObject();
  delete req.user.password;

  next();
});
