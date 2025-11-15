import { create } from "zustand";
import { useAuthStore } from "./useAuthStore";

export const usePokerStore = create((set, get) => ({
  cards: [],
  isStart: 0,
  round: 0,
  isBet: 0,
  pot: 0,
  smallBlind: null,
  bigBlind: null,
  turnPlayerId: null,
  currentCardonTable: [],
  blindsPosted: false,
  bet: 0,
  raise: 0,
  playersCard: [],
  showdown: false,

  setIsStart: (value) => set({ isStart: value }),

  startGame: async (roomId) => {
    const { socket } = useAuthStore.getState();
    const { isStart } = get();
    console.log("isStart: ", isStart);

    if (isStart === 0) return;
    set({ round: 0 });
    const currentRound = get().round;

    console.log("Step 1: Shuffle card function in frontend");
    get().shuffleCards(roomId);
    if (currentRound === 0) {
      console.log("Current round: ", currentRound);
      socket.emit("init_round", { roomId, round: currentRound });
    }

    socket.on("init_round", ({ roomId, round }) => {
      console.log("Current round: ", round);
      socket.emit("init_round", { roomId, round });
      if (round === 5) {
        console.log("Show down - Stop");
      }
    });
  },

  betChips: async (chipBet, roomId, playerId, action) => {
    const { socket } = useAuthStore.getState();
    socket.on("result_action", ({ bet }) => {
      set({ bet: bet });
      console.log("Bet status in frontend:", bet);
    });

    console.log(`PlayerId ${playerId}'s turn sent ${action}`);
    console.log("Step 5: Bet_chip in frontend");
    socket.emit("bet_chip", { chipBet, roomId, playerId, action });
  },

  shuffleCards: async (roomId) => {
    const { socket } = useAuthStore.getState();
    console.log("Function shuffle card frontend");
    socket.emit("deal_cards", { roomId });
  },

  initSocketListeners: () => {
    const { socket } = useAuthStore.getState();
    if (!socket) return;

    socket.off("result_action");
    socket.on("result_action", ({ bet }) => {
      set({ bet });
      console.log("Bet status in frontend:", bet);
    });

    socket.off("next_turn");
    socket.on("next_turn", ({ playerId, round }) => {
      console.log("It's now player turn:", playerId, " at round: ", round);
      set({ turnPlayerId: playerId });
    });

    socket.off("preflop_round");
    socket.on("preflop_round", ({ round, roomId }) => {
      console.log("Preflop started! Round:", round);
      set({ round: round });
      socket.emit("start_flop", { roomId, round });
      console.log("Finish round preflop - Ready for flop round");
    });

    socket.off("flop_round");
    socket.on("flop_round", ({ round, roomId }) => {
      console.log("Flop started! Round:", round);
      set({ round: round });
      socket.emit("start_turn", { roomId, round });
      console.log("Finish");
    });

    socket.off("turn_round");
    socket.on("turn_round", ({ round, roomId }) => {
      console.log("Turn started! Round:", round);
      set({ round: round });
      socket.emit("start_river", { roomId, round });
      console.log("Finish");
    });

    socket.off("river_round");
    socket.on("river_round", ({ round, roomId }) => {
      console.log("River started! Round:", round);
      set({ round: round });
      socket.emit("showdown", { roomId, round });
      set({ showdown: true });
      console.log("Finish");
    });

    socket.off("player_card_show");
    socket.on("player_card_show", ({ showdownCards }) => {
      console.log("Showdown cards:", showdownCards);
      set(() => ({
        playersCard: showdownCards,
      }));
      console.log("finish");
    });

    socket.off("end_round");
    socket.on("end_round", ({ room, roomId }) => {
      console.log("End round - Show card(s)");
      set(() => ({
        currentCardonTable: [...room.currentCard],
      }));
      console.log("Current card: ", get().currentCardonTable);
    });

    socket.off("round_end");
    socket.on("round_end", ({ round, pot }) => {
      console.log(`Round ${round} ended. Pot: ${pot}`);
    });

    socket.off("room_reset");
    socket.on("room_reset", () => {
      console.log("Room has been reset — clearing table.");
      set({
        currentCardonTable: [],
      });
    });

    socket.off("next_round");
    socket.on("next_round", ({ roomId, round }) => {
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
