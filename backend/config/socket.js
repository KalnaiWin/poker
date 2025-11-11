import { Server } from "socket.io";
import http from "http";
import express from "express";
import { ENV } from "./env.js";
import { socketAuthMiddleware } from "../middlewares/socket.auth.middlewsre.js";
import { createTable, dealCards, shuffleCards } from "../game/PokerRules.js";

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
      rooms.set(roomId, {
        deck: shuffleCards(createTable()),
        members: [],
        pot: 0,
        round: 1,
        currentBet: 0,
        currentTurn: 0,
        currentCard: [],
        bets: new Map(),
        playersInRound: new Set(),
      });
    }

    const room = rooms.get(roomId);

    playerSocketMap[playerId] = socket.id;

    const existingPlayerIndex = room.members.findIndex(
      (p) => p._id === playerId
    );

    if (existingPlayerIndex !== -1) {
      room.members[existingPlayerIndex].socketId = socket.id;
    } else
      room.members.push({
        _id: playerId,
        name: playerName,
        socketId: playerSocketMap[playerId],
        hand: [],
        chipsBet: [],
      });

    socket.join(roomId);
    // io.to(roomId).emit("room_update", room);

    const allCards = room.members
      .filter((p) => p.hand && p.hand.length > 0)
      .map((p) => ({
        playerId: p._id,
        name: p.name,
        hand: p.hand,
        chips: p.chips,
      }));

    if (allCards.length > 0) {
      io.to(roomId).emit("all_cards_sync", { cards: allCards });
    }
    // console.log(room);
    // console.log(`${socket.player.name} joined room ${roomId}`);
  });

  socket.on("leave_room", ({ roomId, playerId }) => {
    const room = rooms.get(roomId);
    if (!room) return;

    room.members = room.members.filter((p) => p._id !== playerId);

    io.to(roomId).emit("leave_cards", { playerId });

    if (room.members.length === 0) {
      Object.assign(room, {
        deck: shuffleCards(createTable()),
        currentCard: [],
        pot: 0,
        round: 1,
        currentBet: 0,
        currentTurn: 0,
        bets: new Map(),
        playersInRound: new Set(),
      });

      io.to(roomId).emit("room_reset", room);
    }

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
      player.hand = dealCards(room.deck, 2);
      console.log(`${player.name} hand has: `, player.hand);
    });

    room.members.forEach((player) => {
      io.to(player.socketId).emit("cards_updated", {
        playerId: player._id,
        name: player.name,
        hand: player.hand,
        chips: player.chips,
      });
    });
  });

  socket.on("bet_chip", ({ chipBet, roomId, playerId, action }) => {
    const room = rooms.get(roomId);
    if (!room) return;

    const playerIndex = room.members.findIndex((p) => p._id === playerId);
    if (playerIndex === -1) return;

    const player = room.members[playerIndex];

    if (action === "fold") {
      room.playersInRound.delete(playerId);
    } else if (action === "call" || action === "bet") {
      if (chipBet > player.chips) return;
      player.chips -= chipBet;

      room.pot += chipBet;
      room.bets.set(playerId, (room.bets.get(playerId) || 0) + chipBet);
      if (chipBet > room.currentBet) {
        room.currentBet = chipBet;
      }
    }

    // move to next player
    room.currentTurn = (room.currentTurn + 1) % room.members.length;

    const allCalled = [...room.playersInRound].every(
      (pid) => room.bets.get(pid) === room.currentBet
    );

    if (allCalled) {
      io.to(roomId).emit("round_end", { round: room.round, pot: room.pot });
      room.round += 1;
      room.currentBet = 0;
      room.bets.clear();
      room.currentTurn = 0;
      io.to(roomId).emit("next_round", { round: room.round });
    } else {
      // Notify next player's turn
      const nextPlayer = room.members[room.currentTurn];
      io.to(roomId).emit("next_turn", { playerId: nextPlayer._id });
    }
    io.to(roomId).emit("chips_updated", player);
  });

  socket.on("start_round", ({ roomId, round }) => {
    if (round !== 1 || !roomId) return;

    const room = rooms.get(roomId);

    const flop = dealCards(room.deck, 3);
    room.currentCard.push(...flop);
    console.log(room, flop);
  
    io.to(roomId).emit("flop_round", room, flop);
  });
});

export { io, app, server };
