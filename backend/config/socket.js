import { Server } from "socket.io";
import http from "http";
import express from "express";
import { ENV } from "./env.js";
import { socketAuthMiddleware } from "../middlewares/socket.auth.middlewsre.js";

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

// check if player is online or offline
export function getReceiverSocketId(playerId) {
  return playerSocketMap[playerId];
}

// storing online players
const playerSocketMap = {}; // { playerId: socketId }

io.on("connection", (socket) => {
  console.log("A player connected", socket.player.name);

  const playerId = socket.playerId;
  playerSocketMap[playerId] = socket.id;

  //   send events to all connected clients
  io.emit("getOnlineplayers", Object.keys(playerSocketMap));

  // with sokect.on we listen for events from clients
  socket.on("disconnect", () => {
    console.log("A player disconnected", socket.player.name);
    delete playerSocketMap[playerId];
    io.emit("getOnlineplayers", Object.keys(playerSocketMap));
  });
});

export { io, app, server };
