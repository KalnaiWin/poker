import { create } from "zustand";
import { useAuthStore } from "./useAuthStore";

export const usePokerStore = create((set, get) => ({
  cards: [],
  isStart: 0,
  round: 0,
  isBet: 0,
  pot: 0,
  turnPlayerId: null,
  currentCardonTable: [],

  startGame: async (roomId, chipBet, playerId, action, role) => {
    const { socket } = useAuthStore.getState();
    const { isStart } = get();

    if (isStart) return;

    set({ isStart: true, round: 0 });

    console.log("Step 1: Shuffle card function in frontend");
    get().shuffleCards(roomId);

    console.log("Finish step 1");
    console.log("Start bet to show 3 cards (game_start)");
    socket.emit("game_start", { roomId, playerId, role });

    // preflop
    console.log("Step: 7: Start Preflop in frontend");
    // preflop round

    // set({ isStart: true, round: 2 }); // flop
    // socket.emit("flop_round", { roomId, round: 2 }); // flop round

    // set({ isStart: true, round: 3 }); // turn
    // socket.emit("turn_round", { roomId, round: 3 }); // turn round

    // set({ isStart: true, round: 4 }); // river
    // socket.emit("river_round", { roomId, round: 4 }); // river round
  },

  betChips: async (chipBet, roomId, playerId, action) => {
    const { socket } = useAuthStore.getState();
    console.log(`PlayerId ${playerId}'s turn sent ${action}`);
    console.log("Step 5: Bet_chip in frontend");
    if (action === "bet") {
      socket.emit("bet_chip", { chipBet, roomId, playerId, action });
    } else {
      socket.emit("bet_chip", { roomId, playerId, action });
    }
  },

  shuffleCards: async (roomId) => {
    const { socket } = useAuthStore.getState();
    console.log("Function shuffle card frontend");
    socket.emit("deal_cards", { roomId });
  },

  initSocketListeners: () => {
    const { socket } = useAuthStore.getState();
    if (!socket) return;

    socket.off("next_turn");
    socket.on("next_turn", ({ playerId }) => {
      console.log("It's now player turn:", playerId);
      set({ turnPlayerId: playerId });
    });

    socket.off("preflop_round");
    socket.on("preflop_round", ({ round, roomId }) => {
      console.log("Preflop started! Round:", round);
      set({ round: round });
      socket.emit("start_preflop", { roomId, round });
      console.log("Finish");
    });

    socket.off("round_end");
    socket.on("round_end", ({ round, pot }) => {
      console.log(`Round ${round} ended. Pot: ${pot}`);
    });

    socket.off("end_preflop");
    socket.on("end_preflop", (room, card) => {
      set((state) => ({
        currentCardonTable: [...state.currentCardonTable, ...room.currentCard],
      }));
      console.log("Current card: ", get().currentCardonTable);
    });

    socket.off("room_reset");
    socket.on("room_reset", () => {
      console.log("Room has been reset — clearing table.");
      set({
        currentCardonTable: [],
      });
    });

    socket.off("next_round");
    socket.on("next_round", ({ round }) => {
      console.log(`Starting Round ${round}`);
      set({ round: round });
    });

    socket.off("cards_updated");
    socket.on("cards_updated", ({ playerId, name, hand }) => {
      console.log("Step 3: Card_updates in frontend");
      console.log("Received cards:", { playerId, name, hand });
      set((state) => {
        const existingIndex = state.cards.findIndex(
          (p) => p.playerId === playerId
        );

        if (existingIndex !== -1) {
          const updatedCards = [...state.cards];
          updatedCards[existingIndex] = { playerId, name, hand };
          return { cards: updatedCards };
        } else {
          return { cards: [...state.cards, { playerId, name, hand }] };
        }
      });
    });

    socket.off("all_cards_sync");
    socket.on("all_cards_sync", ({ cards }) => {
      console.log("Syncing all cards:", cards);
      set({ cards });
    });

    socket.off("leave_cards");
    socket.on("leave_cards", ({ playerId }) => {
      set((state) => ({
        cards: state.cards.filter((p) => p.playerId !== playerId),
      }));
    });
  },
}));
