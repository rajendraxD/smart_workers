import express from "express";
import authRoutes from "./authRouter.js";
import userRoutes from "./userRouter.js";

const router = express.Router();

router.get("/health", (_req, res) =>
  res.json({
    success: true,
    message: "API is healthy",
    timestamp: new Date().toISOString(),
  }),
);

router.use("/auth", authRoutes);
router.use("/user", userRoutes);

export default router;
