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
        isBet: false,
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
        preflopStarted: false,
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
    console.log("Step 2: Deal card in backend");
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
    console.log("Step 6: bet_chip in backend");

    const room = rooms.get(roomId);
    if (!room) return;

    room.playersInRound =
      room.playersInRound || new Set(room.members.map((m) => m._id));
    room.bets = room.bets || new Map();
    room.pot = room.pot || 0;
    room.currentBet = room.currentBet || 0;

    const playerIndex = room.members.findIndex((p) => p._id === playerId);
    if (playerIndex === -1) return;

    const player = room.members[playerIndex];

    if (!room.playersInRound.has(playerId)) {
      console.log("Player not in round:", playerId);
      return;
    }

    if (action === "fold") {
      room.playersInRound.delete(playerId);
      room.bets.delete(playerId);
    } else if (action === "check") {
      const myBet = room.bets.get(playerId) || 0;
      if (myBet !== room.currentBet) {
        console.log("Invalid check attempt by", playerId);
        io.to(roomId).emit("invalid_action", {
          playerId,
          reason: "cannot check",
        });
        return;
      }
    } else if (action === "call") {
      const myBet = room.bets.get(playerId) || 0;
      const toCall = Math.max(0, room.currentBet - myBet);
      const take = Math.min(toCall, player.chips);
      if (take <= 0) {
      } else {
        player.chips -= take;
        room.pot += take;
        room.bets.set(playerId, myBet + take);
      }
    } else if (action === "bet") {
      const myBet = room.bets.get(playerId) || 0;
      const targetBet = Number(chipBet) || 0;
      if (targetBet <= myBet) {
        console.log(
          "Invalid bet amount from",
          playerId,
          targetBet,
          "myBet:",
          myBet
        );
        io.to(roomId).emit("invalid_action", {
          playerId,
          reason: "invalid bet amount",
        });
        return;
      }
      const additional = targetBet - myBet;
      if (additional > player.chips) {
        const allin = player.chips;
        player.chips -= allin;
        room.pot += allin;
        room.bets.set(playerId, myBet + allin);
        if (myBet + allin > room.currentBet) room.currentBet = myBet + allin;
      } else {
        player.chips -= additional;
        room.pot += additional;
        room.bets.set(playerId, targetBet);
        if (targetBet > room.currentBet) room.currentBet = targetBet;
      }
    } else {
      console.log("Unknown action:", action);
      return;
    }

    let attempts = 0;
    do {
      room.currentTurn = (room.currentTurn + 1) % room.members.length;
      const nextPlayerId = room.members[room.currentTurn]._id;
      if (room.playersInRound.has(nextPlayerId)) break;
      attempts++;
    } while (attempts < room.members.length);

    if (room.playersInRound.size <= 1) {
      io.to(roomId).emit("round_end", { round: room.round, pot: room.pot });
      return;
    }

    const allCalled = [...room.playersInRound].every((pid) => {
      const b = room.bets.get(pid) || 0;
      return b >= room.currentBet;
    });

    io.to(roomId).emit("chips_updated", {
      playerId: player._id,
      chips: player.chips,
      bet: room.bets.get(player._id) || 0,
      pot: room.pot,
    });

    if (allCalled) {
      io.to(roomId).emit("round_end", { round: room.round, pot: room.pot });
      console.log("Round_end in backend");
      room.round += 1;
      room.currentBet = 0;
      room.bets = new Map();

      let startIndex = 0;
      for (let i = 0; i < room.members.length; i++) {
        if (room.playersInRound.has(room.members[i]._id)) {
          startIndex = i;
          break;
        }
      }
      room.currentTurn = startIndex;

      if (room.round === 1) {
        console.log("Pre flop stage");
        io.to(roomId).emit("preflop_round", { round: 1, roomId });
      }
      console.log("Round advanced to", room.round);
    } else {
      const nextPlayer = room.members[room.currentTurn];
      io.to(roomId).emit("next_turn", { playerId: nextPlayer._id });
      console.log("Next turn:", nextPlayer._id);
    }
  });

  socket.on("start_preflop", ({ roomId, round }) => {
    if (round !== 1 || !roomId || room.preflopStarted) return;

    const room = rooms.get(roomId);

    room.preflopStarted = true;

    const flop = dealCards(room.deck, 3);
    room.currentCard.push(...flop);

    console.log("Preflop started — dealing 3 cards:", flop);

    console.log("End preflop");
    io.to(roomId).emit("end_preflop", room, flop);
  });

  socket.on("next_round", ({ round }) => {
    if (round === 2) socket.emit("flop_round", { roomId });
    if (round === 3) socket.emit("turn_round", { roomId });
    if (round === 4) socket.emit("river_round", { roomId });
  });

  socket.on("game_start", ({ roomId, playerId, role }) => {
    console.log("Step 4: Game_satrt function in backend");

    const room = rooms.get(roomId);
    if (!room) return;

    room.round = 0;
    room.currentBet = 0;
    room.pot = room.pot || 0;
    room.bets = room.bets || new Map();
    room.playersInRound = new Set(room.members.map((m) => m._id));

    const smallBlind = 10;
    const bigBlind = 20;

    const dealerIndex = Math.floor(Math.random() * room.members.length);
    const sbIndex = (dealerIndex + 1) % room.members.length;
    const bbIndex = (dealerIndex + 2) % room.members.length;

    const sbPlayer = room.members[sbIndex];
    const bbPlayer = room.members[bbIndex];

    const sbPut = Math.min(smallBlind, sbPlayer.chips);
    const bbPut = Math.min(bigBlind, bbPlayer.chips);

    sbPlayer.chips -= sbPut;
    bbPlayer.chips -= bbPut;

    room.bets.set(sbPlayer._id, sbPut);
    room.bets.set(bbPlayer._id, bbPut);

    room.currentBet = bbPut;
    room.pot = (room.pot || 0) + sbPut + bbPut;

    room.currentTurn = (bbIndex + 1) % room.members.length;

    console.log("Ready for next_turn bet");
    const nextPlayer = room.members[room.currentTurn];
    io.to(roomId).emit("next_turn", { playerId: nextPlayer._id });
  });
});

export { io, app, server };
