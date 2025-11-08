import express from "express";
import { protectedRoute } from "../middlewares/auth.middleware.js";
import { arcjetProtection } from "../middlewares/arcjet.middleware.js";
import {
  GetAllMessage,
  ReplyMessage,
  ResetMessages,
  SendMessage,
} from "../controllers/message.controller.js";

const router = express.Router();

router.use(arcjetProtection, protectedRoute);

router.get("/:roomId", GetAllMessage);
router.post("/:roomId/send", SendMessage);
router.post("/:roomId/reply", ReplyMessage);
router.delete("/:roomId/reset", ResetMessages);

export default router;
