import jwt from "jsonwebtoken";
import { ENV } from "./env.js";

export const genrateToken = (playerId, res) => {
  // .sign( object , secretKey, option )
  const token = jwt.sign({ playerId }, ENV.JWT_SECRET, {
    expiresIn: "7d", // seven days
  });

  res.cookie("jwt", token, {
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 day
    httpOnly: true, // prevent XSS attacks: cross-site scripting
    sameSite: ENV.NODE_ENV === "production" ? "none" : "lax", // "none" for cross-origin in production
    secure: ENV.NODE_ENV === "production", // true in production
    path: "/",
  });

  return token;
};
