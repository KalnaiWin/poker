import { Server } from "socket.io";
import http from "http";
import express from "express";
import { ENV } from "./env.js";
import { socketAuthMiddleware } from "../middlewares/socket.auth.middlewsre.js";
import Player from "../databases/models/Player.js";

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

  socket.on("join_room", async ({ roomId, playerId }) => {
    socket.join(roomId);
    console.log(`${socket.player.name} joined room ${roomId}`);
  });

  socket.on("leave_room", ({ roomId }) => {
    socket.leave(roomId);
    console.log(`${socket.player.name} left room ${roomId}`);
    io.to(roomId).emit("user_left", { name: socket.player.name });
  });

  socket.on("kick_player", ({ roomId, playerId }) => {
    console.log("Kick request received:", roomId, playerId);
  });

  socket.on("send_message", ({ message, roomId }) => {
    // console.log("Message received:", message, "Room:", roomId);
    io.to(roomId).emit("receive_message", { message, roomId });
  });
});

export { io, app, server };
