import express from "express";
import authRoutes from "./authRouter.js";

const router = express.Router();

router.get("/health", (_req, res) =>
  res.json({
    success: true,
    message: "API is healthy",
    timestamp: new Date().toISOString(),
  }),
);

router.use("/auth", authRoutes);

export default router;
