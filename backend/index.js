import express from "express";
import path from "path";
import cookieParser from "cookie-parser";
import cors from "cors";

import { ENV } from "./config/env.js";
import { connectDB } from "./databases/db.js";
import authRoute from "./routes/auth.route.js";

const app = express();

const port = ENV.PORT || 8000;

const __dirname = path.resolve();

app.use(express.json());
app.use(cors({ origin: ENV.CLIENT_URL, credentials: true }));
app.use(cookieParser());

app.use("/api/auth", authRoute);

app.use("/avatars", express.static("public/avatar"));

if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "../frontend/dist")));
  app.get("/*splat", (_, res) => {
    res.sendFile(path.join(__dirname, "../frontend/dist/index.html"));
  });
}

connectDB()
  .then(() => {
    app.listen(port, () => {
      console.log("Server running on port: ", port);
    });
  })
  .catch((err) => {
    console.error("Failed to connect to the database", err);
    process.exit(1);
  });
