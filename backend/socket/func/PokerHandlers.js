import { dealCards, shuffleCards } from "../../game/PokerRules.js";

export function PokerHandlers(io, socket, rooms, playerSocketMap) {
  socket.on("deal_cards", ({ roomId }) => {
    console.log("Step 2: Deal card in backend");
    const room = rooms.get(roomId);
    if (!room) return;

    // If deck has less than 2 cards, reshuffle
    if (room.deck.length < room.members.length * 2) {
      room.deck = shuffleCards(room.deck);
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
    room.playerActed.add(playerId);

    room.playersInRound =
      room.playersInRound || new Set(room.members.map((m) => m._id));
    room.bets = room.bets || new Map();
    room.pot = room.pot || 0;
    room.currentBet = room.currentBet || 0;

    const myBet = room.bets.get(playerId) || 0;
    const currentBet = room.currentBet;

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
      room.playerActed.delete(playerId);
      console.log(`${player.name}'s action: fold`);
    } else if (action === "check") {
      if (myBet !== room.currentBet) {
        console.log("Invalid check attempt by", playerId);
        io.to(roomId).emit("invalid_action", {
          playerId,
          reason: "cannot check",
        });
        return;
      }
      console.log(`${player.name}'s action: check`);
    } else if (action === "call") {
      const toCall = currentBet - myBet;
      if (toCall <= 0) {
        io.to(roomId).emit("invalid_action", {
          playerId,
          reason: "Nothing to call (you should check or fold instead)",
        });
        return;
      } else {
        const callAmount = Math.min(toCall, player.chips);
        player.chips -= callAmount;
        room.pot += callAmount;
        room.bets.set(playerId, myBet + callAmount);

        console.log(`${player.name} calls for ${callAmount}`);

        // All-in handling
        if (player.chips === 0) {
          console.log(`${player.name} is all-in`);
        }
      }
      console.log(`${player.name}'s action: call`);
    } else if (action === "bet") {
      const betSize = Number(chipBet);
      if (currentBet > 0) {
        io.to(roomId).emit("invalid_action", {
          playerId,
          reason: "Cannot bet, a bet already exists (use raise)",
        });
        return;
      }

      if (betSize <= 0) {
        io.to(roomId).emit("invalid_action", {
          playerId,
          reason: "Invalid bet amount",
        });
        return;
      }

      if (betSize > player.chips) {
        io.to(roomId).emit("invalid_action", {
          playerId,
          reason: "Bet exceeds your chips",
        });
        return;
      }

      // Deduct chips
      player.chips -= betSize;
      room.pot += betSize;
      room.bets.set(playerId, betSize);
      room.currentBet = betSize;

      console.log(`${player.name} bets ${betSize}`);
      room.playerActed.clear();
      console.log(`${player.name}'s action: bet`);
      if (room.isBet !== 1) {
        room.isBet = 1;
      }
    } else if (action === "raise") {
      const raiseTo = Number(chipBet);
      if (currentBet === 0) {
        io.to(roomId).emit("invalid_action", {
          playerId,
          reason: "Cannot raise, no existing bet (use bet)",
        });
        return;
      }

      if (raiseTo <= currentBet) {
        io.to(roomId).emit("invalid_action", {
          playerId,
          reason: "Raise must be higher than current bet",
        });
        return;
      }

      const required = raiseTo - myBet;

      if (required > player.chips) {
        io.to(roomId).emit("invalid_action", {
          playerId,
          reason: "Not enough chips to raise",
        });
        return;
      }

      // Deduct chips
      player.chips -= required;
      room.pot += required;
      room.bets.set(playerId, raiseTo);
      room.currentBet = raiseTo;

      console.log(`${player.name} raises to ${raiseTo}`);

      room.playerActed.clear();
      console.log(`${player.name}'s action: raise`);
      room.isRaise = 1;
      console.log(room.isRaise);
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

    const everyoneActed = [...room.playersInRound].every((pid) =>
      room.playerActed.has(pid)
    );

    // const allCalled = [...room.playersInRound].every((pid) => {
    //   const b = room.bets.get(pid) || 0;
    //   return b >= room.currentBet;
    // });

    // io.to(roomId).emit("chips_updated", {
    //   playerId: player._id,
    //   chips: player.chips,
    //   bet: room.bets.get(player._id) || 0,
    //   pot: room.pot,
    // });

    const nextPlayer = room.members[room.currentTurn];

    if (everyoneActed) {
      io.to(roomId).emit("round_end", { round: room.round, roomId });
      console.log("Round_end in backend: ", room.round);
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

      io.to(roomId).emit("result_action", {
        bet: 0,
        raise: 0,
      });

      if (room.round === 1) {
        console.log("preflop stage");
        io.to(roomId).emit("preflop_round", { round: 1, roomId });
      } else if (room.round === 2) {
        console.log("Flop stage");
        io.to(roomId).emit("flop_round", { roomId, round: 2, room });
      } else if (room.round === 3) {
        console.log("Turn stage");
        io.to(roomId).emit("turn_round", { round: 3, roomId });
      } else if (room.round == 4) {
        console.log("River stage");
        io.to(roomId).emit("river_round", { round: 4, roomId });
      }
      console.log("Round advanced to", room.round);
    } else {
      // io.to(roomId).emit("result_action", {
      //   bet: room.isBet,
      //   raise: room.isRaise,
      // });
      io.to(roomId).emit("next_turn", {
        playerId: nextPlayer._id,
        round: room.round,
      });
    }
    io.to(roomId).emit("update_state", {
      currentBet: room.currentBet,
      turnPlayerId: nextPlayer._id,

      players: room.members.map((p) => ({
        _id: p._id,
        name: p.name,
        chips: p.chips,
        betThisRound: room.bets.get(p._id) || 0,
        isInRound: room.playersInRound.has(p._id),
      })),
    });
  });

  socket.on("init_round", ({ roomId, round }) => {
    const room = rooms.get(roomId);
    if (!room) return;

    room.round = round;
    console.log("Room :", room.round);
    room.currentBet = 0;
    room.pot = room.pot || 0;
    room.bets = room.bets || new Map();
    room.playerActed = new Set();
    room.playersInRound = new Set(room.members.map((m) => m._id));

    console.log("Ready for next_turn bet");
    const nextPlayer = room.members[0];
    console.log("player Id at init_round (next_turn): ", nextPlayer._id);
    io.to(roomId).emit("next_turn", { playerId: nextPlayer._id, round });
  });

  socket.on("start_flop", ({ roomId, round }) => {
    const room = rooms.get(roomId);

    if (round !== 1 || !roomId || room.flopStarted) return;

    room.flopStarted = true;

    const preflop = dealCards(room.deck, 3);
    room.currentCard.push(...preflop);

    console.log("Flop started — dealing 3 cards:");
    console.log("End flop");
    io.to(roomId).emit("end_round", { room, roomId });

    const newRound = round;
    console.log("Next round: ", newRound);
    io.to(roomId).emit("init_round", { roomId, round: newRound });
    console.log("Send init round: ", newRound);
  });

  socket.on("start_turn", ({ roomId, round }) => {
    const room = rooms.get(roomId);

    if (round !== 2 || !roomId || room.turnStarted) return;

    room.turnStarted = true;

    const turn = dealCards(room.deck, 1);
    room.currentCard.push(...turn);

    console.log("Turn started - dealing 1 cards: ", turn);
    console.log("End turn");
    io.to(roomId).emit("end_round", {
      room: {
        ...room,
        currentCard: room.currentCard,
      },
      roomId,
    });
    const newRound = round;
    console.log("Next round: ", newRound);
    io.to(roomId).emit("init_round", { roomId, round: newRound });
    console.log("Send init round: ", newRound);
  });

  socket.on("start_river", ({ roomId, round }) => {
    const room = rooms.get(roomId);

    if (round !== 3 || !roomId || room.riverStarted) return;

    room.riverStarted = true;

    const river = dealCards(room.deck, 1);
    room.currentCard.push(...river);

    console.log("River started - dealing 1 cards: ", river);
    console.log("End river");
    io.to(roomId).emit("end_round", {
      room: {
        ...room,
        currentCard: room.currentCard,
      },
      roomId,
    });
    const newRound = round;
    console.log("Next round: ", newRound);
    io.to(roomId).emit("init_round", { roomId, round: newRound });
    console.log("Send init round: ", newRound);
  });

  socket.on("showdown", ({ roomId, round }) => {
    const room = rooms.get(roomId);
    if (round !== 4 || !roomId || room.showdown) return;

    room.showdown = true;
    const showdownCards = {};
    room.members.forEach((player) => {
      showdownCards[player._id] = player.hand;
    });

    console.log("All cards of players", showdownCards);

    io.to(roomId).emit("player_card_show", {
      showdownCards,
    });
  });

  socket.on("next_round", ({ roomId, round }) => {
    io.to(roomId).emit("init_round", { roomId, round });
    console.log("Init round: ", round);
  });
}
