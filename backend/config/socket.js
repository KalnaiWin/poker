import { Server } from "socket.io";
import http from "http";
import express from "express";
import { ENV } from "./env.js";
import { socketAuthMiddleware } from "../middlewares/socket.auth.middlewsre.js";
import { createTable, dealTwoCards, shuffleCards } from "../game/PokerRules.js";

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
const rooms = new Map(); // Create a room inclue players and table

io.on("connection", (socket) => {
  // console.log("A player connected", socket.player.name);

  const playerId = socket.playerId;
  playerSocketMap[playerId] = socket.id;

  //   send events to all connected clients
  io.emit("getOnlineplayers", Object.keys(playerSocketMap));

  // with sokect.on we listen for events from clients
  socket.on("disconnect", () => {
    // console.log("A player disconnected", socket.player.name);
    delete playerSocketMap[playerId];
    io.emit("getOnlineplayers", Object.keys(playerSocketMap));
  });

  socket.on("join_room", async ({ roomId, playerId, playerName }) => {
    if (!rooms.has(roomId)) {
      rooms.set(roomId, { deck: shuffleCards(createTable()), members: [] });
    }
    const room = rooms.get(roomId);
    room.members.push({
      _id: playerId,
      name: playerName,
      socketId: playerSocketMap[playerId],
      hand: [],
    });
    socket.join(roomId);
    io.to(roomId).emit("room_update", room);
    // console.log(`${socket.player.name} joined room ${roomId}`);
  });

  socket.on("leave_room", ({ roomId, playerId }) => {
    const room = rooms.get(roomId);
    if (!room) return;

    room.members = room.members.filter((p) => p._id !== playerId);

    io.to(roomId).emit("leave_cards", { playerId });

    socket.leave(roomId);
    // console.log(`${socket.player.name} left room ${roomId}`);
  });

  socket.on("kick_player", ({ roomId, playerId }) => {
    // console.log("Kick request received:", roomId, playerId);
  });

  socket.on("send_message", ({ message, roomId }) => {
    // console.log("Message received:", message, "Room:", roomId);
    io.to(roomId).emit("receive_message", { message, roomId });
  });

  socket.on("deal_cards", ({ roomId }) => {
    const room = rooms.get(roomId);
    if (!room) return;

    // If deck has less than 2 cards, reshuffle
    if (room.deck.length < room.members.length * 2) {
      room.deck = shuffleCards(createDeck());
    }

    room.members.forEach((player) => {
      player.hand = dealTwoCards(room.deck);
      console.log(`${player.name} hand has: `, player.hand);
    });

    io.to(roomId).emit("cards_updated", {
      players: room.members.map((p) => ({
        playerId: p._id,
        name: p.name,
        hand: p.hand,
      })),
    });
  });
});

export { io, app, server };
