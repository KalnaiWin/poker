import express from "express";
import {
  GetHistory,
  Login,
  LogOut,
  SignUp,
} from "../controllers/auth.controller.js";
import { protectedRoute } from "../middlewares/auth.middleware.js";
import { arcjetProtection } from "../middlewares/arcjet.middleware.js";

const router = express.Router();

router.use(arcjetProtection);

router.post("/signup", SignUp);
router.post("/login", Login);
router.post("/logout", LogOut);
router.get("/history", protectedRoute, GetHistory);
router.get("/check", protectedRoute, (req, res) => {
  res.status(200).json(req.player);
});

export default router;
