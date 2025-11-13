import { Server } from "socket.io";
import http from "http";
import express from "express";
import { ENV } from "./env.js";
import { socketAuthMiddleware } from "../middlewares/socket.auth.middlewsre.js";
import { registerSocketHandlers } from "../socket/index.js";

//  create a server including rest api and socket server
const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: [ENV.CLIENT_URL],
    credentials: true,
  },
});
// apply authentication middleware to all socket connections
io.use(socketAuthMiddleware);

registerSocketHandlers(io);

export { io, app, server };
