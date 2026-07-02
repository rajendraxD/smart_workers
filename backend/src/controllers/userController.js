import { sendSuccess } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const profile = asyncHandler(async (req, res) => {
  return sendSuccess(res, { message: "User profile fetched", data: req.user });
});
