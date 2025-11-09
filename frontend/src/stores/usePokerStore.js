import { create } from "zustand";
import { useAuthStore } from "./useAuthStore";

export const usePokerStore = create((set, get) => ({
  cards: [],

  startGame: async (roomId, isStart) => {
    if (isStart) get().shuffleCards(roomId);
  },

  shuffleCards: async (roomId) => {
    const { socket } = useAuthStore.getState();
    socket.emit("deal_cards", { roomId });
  },

  initSocketListeners: () => {
    const { socket } = useAuthStore.getState();
    if (!socket) return;

    socket.off("cards_updated");
    socket.on("cards_updated", ({ players }) => {
      set({ cards: players });
    });

    socket.off("leave_cards");
    socket.on("leave_cards", ({ playerId }) => {
      set((state) => ({
        cards: state.cards.filter((p) => p.playerId !== playerId),
      }));
    });
  },
}));
