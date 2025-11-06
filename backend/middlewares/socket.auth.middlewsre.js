import jwt from "jsonwebtoken";
import Player from "../databases/models/Player.js";
import { ENV } from "../config/env.js";

export const socketAuthMiddleware = async (socket, next) => {
  try {
    console.log("Socket connection attempt from:", socket.handshake.address);
    console.log("Cookies:", socket.handshake.headers.cookie);

    // extarct token from http cookie
    const token = socket.handshake.headers.cookie
      ?.split("; ")
      .find((row) => row.startsWith("jwt="))
      ?.split("=")[1];

    if (!token) {
      console.log("Socket connection rejected: No token provided");
      return next(new Error("Unauthorized - No token provided"));
    }

    // verify the token
    const decoded = jwt.verify(token, ENV.JWT_SECRET);
    if (!decoded) {
      console.log("Socket connection rejected: Invalid token");
      return next(new Error("Unauthorized - Invalid token"));
    }

    // find the player from db
    const player = await Player.findById(decoded.playerId).select("-password"); // get all field but not password
    if (!player) {
      console.log("Socket connection rejected: player not found");
      return next(new Error("player not found"));
    }

    socket.player = player;
    socket.playerId = player._id.toString();
    next();
  } catch (error) {
    console.log("Error in socket authentication: ", error.message);
    next(new Error("Unauthorized - Authentication failed"));
  }
};
