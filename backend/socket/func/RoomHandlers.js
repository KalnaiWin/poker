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
        preflopStarted: false,
        flopStarted: false,
        turnStarted: false,
        riverStarted: false,
        showdown: false,

        playersInRound: new Set(),
        currentBet: 0,
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
}
