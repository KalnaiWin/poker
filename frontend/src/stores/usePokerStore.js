import { create } from "zustand";
import { useAuthStore } from "./useAuthStore";

export const usePokerStore = create((set, get) => ({
  cards: [],
  isStart: 0,
  round: 0,
  turnPlayerId: null,
  currentCardonTable: [],

  startGame: async (roomId) => {
    const { socket } = useAuthStore.getState();
    const { isStart } = get();

    if (isStart) return;

    set({ isStart: true, round: 1 });

    get().shuffleCards(roomId);

    socket.emit("start_round", { roomId, round: 1 });
  },

  betChips: async (chipBet, roomId, playerId, action) => {
    const { socket } = useAuthStore.getState();
    socket.emit("bet_chip", { chipBet, roomId, playerId, action });
  },

  shuffleCards: async (roomId) => {
    const { socket } = useAuthStore.getState();
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

    socket.off("round_end");
    socket.on("round_end", ({ round, pot }) => {
      console.log(`Round ${round} ended. Pot: ${pot}`);
    });

    socket.off("flop_round");
    socket.on("flop_round", (room, card) => {
      // console.log("Room round flop:", room);
      // console.log("Flop round cards:", card);
      set((state) => ({
        currentCardonTable: [...state.currentCardonTable, ...room.currentCard],
      }));
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
      set({ round });
    });

    socket.off("cards_updated");
    socket.on("cards_updated", ({ playerId, name, hand }) => {
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
