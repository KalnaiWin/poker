import jwt from "jsonwebtoken";
import Player from "../databases/models/Player.js";
import { ENV } from "../config/env.js";

export const protectedRoute = async (req, res, next) => {
  try {
    const token = req.cookies.jwt;
    if (!token)
      return res
        .status(401)
        .json({ message: "Unauthorized - No token provided" });

    const decoded = jwt.verify(token, ENV.JWT_SECRET);
    if (!decoded)
      return res.status(401).json({ message: "Unauthorized - Invalid token" });

    const player = await Player.findById(decoded.playerId).select("-password");
    if (!player) return res.status(404).json({ message: "Player not found" });

    req.player = player;
    next();
  } catch (error) {
    console.log("Error in protecteRoute middleware: ", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
