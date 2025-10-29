import express from "express";
import { Login, LogOut, SignUp } from "../controllers/auth.controller.js";
import { protectedRoute } from "../middlewares/auth.middleware.js";
import { arcjetProtection } from "../middlewares/arcjet.middleware.js";

const router = express.Router();

router.use(arcjetProtection);

router.post("/signup", SignUp);
router.post("/login", Login);
router.post("/logout", LogOut);
router.get("/check", protectedRoute, (req, res) => {
  res.status(200).json(req.player);
});

export default router;
