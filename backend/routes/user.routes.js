import express from "express";
import { protect } from "../middlewares/auth.js";
import { registerUser, loginUser, getUser, logoutUser } from "../controllers/user.controller.js";

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/logout", logoutUser);
router.get("/me", protect, getUser);

export default router;