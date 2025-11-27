import { createTable, shuffleCards } from "../../game/PokerRules.js";

export function RoomHandlers(io, socket, rooms, playerSocketMap) {
  socket.on("join_room", async ({ roomId, playerId, playerName }) => {
    if (!rooms.has(roomId)) {
      rooms.set(roomId, {
        deck: shuffleCards(createTable()),
        members: [],
        pot: 0,
        round: 1,
        currentTurn: 0,
        currentCard: [],
        bets: new Map(),
        playerActed: new Set(),
        flopStarted: false,
        turnStarted: false,
        riverStarted: false,
        showdown: false,

        playersInRound: new Set(),
        currentBet: 0,
        playersSpectator: new Set(),

        readyPlayers: new Set(),
        timerRunning: false,
        continueTimer: null,
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
    socket.join(playerId);
    io.to(roomId).emit("player_joined_room", { roomId, playerId });

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
  });

  socket.on("leave_room", ({ roomId, playerId }) => {
    const room = rooms.get(roomId);
    if (!room) return;

    room.playersInRound.delete(playerId);

    room.members = room.members.map((p) =>
      p._id === playerId ? { ...p, hand: [], chipsBet: [] } : p
    );

    room.members = room.members.filter((p) => p._id !== playerId);

    io.to(roomId).emit("leave_cards", { playerId });

    if (room.members.length === 0) {
      Object.assign(room, {
        deck: shuffleCards(createTable()),
        members: [],
        pot: 0,
        round: 1,
        currentTurn: 0,
        currentCard: [],
        bets: new Map(),
        playerActed: new Set(),
        flopStarted: false,
        turnStarted: false,
        riverStarted: false,
        showdown: false,

        playersInRound: new Set(),
        currentBet: 0,
        playersSpectator: new Set(),

        readyPlayers: new Set(),
        timerRunning: false,
        continueTimer: null,
      });

      io.to(roomId).emit("room_reset", room);
    }

    io.to(roomId).emit("player_left_room", { roomId, playerId });
    socket.leave(roomId);
  });

  socket.on("kick_player", ({ roomId, playerId }) => {
    const room = rooms.get(roomId);
    if (!room) return;

    room.members = room.members.filter((p) => p._id !== playerId);

    io.to(roomId).emit("leave_cards", { playerId });

    const kickedSocketId = playerSocketMap[playerId];
    if (kickedSocketId) {
      io.to(kickedSocketId).emit("you_are_kicked", { roomId });
    }

    if (room.members.length === 0) {
      Object.assign(room, {
        deck: shuffleCards(createTable()),
        members: [],
        pot: 0,
        round: 1,
        currentTurn: 0,
        currentCard: [],
        bets: new Map(),
        playerActed: new Set(),
        flopStarted: false,
        turnStarted: false,
        riverStarted: false,
        showdown: false,

        playersInRound: new Set(),
        currentBet: 0,
        playersSpectator: new Set(),

        readyPlayers: new Set(),
        timerRunning: false,
        continueTimer: null,
      });

      io.to(roomId).emit("room_reset", room);
    }
  });
}
