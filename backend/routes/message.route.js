import express from "express";
import { protectedRoute } from "../middlewares/auth.middleware.js";
import { arcjetProtection } from "../middlewares/arcjet.middleware.js";
import {
  GetAllMessage,
  ReplyMessage,
  SendMessage,
} from "../controllers/message.controller.js";

const router = express.Router();

router.use(arcjetProtection, protectedRoute);

router.get("/:roomId", GetAllMessage);
router.post("/", SendMessage);
router.post("/reply", ReplyMessage);

export default router;
