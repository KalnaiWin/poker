import express from "express";
import { protectedRoute } from "../middlewares/auth.middleware.js";
import { arcjetProtection } from "../middlewares/arcjet.middleware.js";
import {
  CreateRoom,
  DeleteRoom,
  GetAllRoom,
  JoinRoom,
  KickPlayer,
  LeaveRoom,
} from "../controllers/room.controller.js";

const router = express.Router();

router.use(arcjetProtection, protectedRoute);

router.post("/create", CreateRoom);
router.delete("/delete/:roomId", DeleteRoom);
router.get("/", GetAllRoom);
router.post("/join/:roomId", JoinRoom);
router.post("/leave/:roomId", LeaveRoom);
router.post("/kick/:roomId", KickPlayer);

export default router;
