import { ChatHandlers } from "./func/ChatHandlers.js";
import { PokerHandlers } from "./func/PokerHandlers.js";
import { RoomHandlers } from "./func/RoomHandlers.js";

// storing online players
export const playerSocketMap = {}; // { playerId: socketId }
export const rooms = new Map(); // Create a room inclue players and table

export function registerSocketHandlers(io) {
  io.on("connection", (socket) => {
    console.log("🔌 Client connected:", socket.id);

    const playerId = socket.playerId;
    playerSocketMap[playerId] = socket.id;

    io.emit("getOnlineplayers", Object.keys(playerSocketMap));

    // Feature modules
    RoomHandlers(io, socket, rooms, playerSocketMap);
    PokerHandlers(io, socket, rooms, playerSocketMap);
    ChatHandlers(io, socket);

    socket.on("disconnect", () => {
      console.log("❌ Client disconnected:", socket.id);
      delete playerSocketMap[playerId];
      io.emit("getOnlineplayers", Object.keys(playerSocketMap));
    });
  });
}
