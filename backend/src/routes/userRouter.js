import express from "express";
import * as userController from "../controllers/userController.js";
import { isAuthenticate } from "../middleware/auth.js";

const router = express.Router();

router.get("/me", isAuthenticate, userController.profile);

export default router;
