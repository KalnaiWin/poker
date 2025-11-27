import { create } from "zustand";
import { useAuthStore } from "./useAuthStore";
import toast from "react-hot-toast";

export const usePokerStore = create((set, get) => ({
  cards: [],
  isStart: 0,
  round: 0,
  pot: 0,
  smallBlind: null,
  bigBlind: null,
  currentCardonTable: [],
  blindsPosted: false,
  playersCard: [],
  showdown: false,
  finish: 0,
  effect: null,

  turnPlayerId: null,
  currentBet: 0,
  players: [],
  result: null,

  // Effect for game
  start: false,
  preFlop: false,
  flop: false,
  turn: false,
  river: false,

  setIsStart: (value) => set({ isStart: value }),

  startGame: async (roomId) => {
    const { socket } = useAuthStore.getState();
    const { isStart, round } = get();

    if (isStart === 0) return;
    set({ round: 0, start: true });
    socket.emit("round_effect_start", { roomId, round });
    setTimeout(() => {
      set({ start: false });
    }, 3000);
    const currentRound = get().round;
    get().shuffleCards(roomId);
    if (currentRound === 0) {
      socket.emit("init_round", { roomId, round: currentRound });
    }

    socket.on("init_round", ({ roomId, round }) => {
      socket.emit("init_round", { roomId, round });
      if (round === 5) {
      }
    });
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

    socket.off();
    socket.on("round_changed", ({ round }) => {
      let effectName = null;
      switch (round) {
        case 0:
          effectName = "start";
          break;
        case 2:
          effectName = "turn";
          break;
        case 3:
          effectName = "river";
          break;
        case 4:
          effectName = "showdown";
          break;
        default:
          effectName = "showdown";
      }
      set({ round, effect: effectName });
      setTimeout(() => set({ effect: null }), 3000);
    });

    socket.off("invalid_action");
    socket.on("invalid_action", ({ playerId, reason }) => {
      toast.error(reason);
    });

    socket.off("next_turn");
    socket.on("next_turn", ({ playerId, round }) => {
      set({ turnPlayerId: playerId });
    });

    socket.off("preflop_round");
    socket.on("preflop_round", ({ round, roomId }) => {
      set({ round: round });
      socket.emit("start_flop", { roomId, round });
    });

    socket.off("flop_round");
    socket.on("flop_round", ({ round, roomId }) => {
      set({ round: round });
      socket.emit("start_turn", { roomId, round });
    });

    socket.off("turn_round");
    socket.on("turn_round", ({ round, roomId }) => {
      set({ round: round });
      socket.emit("start_river", { roomId, round });
    });

    socket.off("river_round");
    socket.on("river_round", ({ round, roomId }) => {
      set({ round: round });
      socket.emit("showdown", { roomId, round });
      set({ showdown: true });
    });

    socket.off("player_card_show");
    socket.on("player_card_show", ({ showdownCards, result, finish }) => {
      if (showdownCards === null) {
        set({ playersCard: null, result: result, finish });
      } else {
        set(() => ({
          playersCard: showdownCards,
          result: result,
          finish,
        }));
      }
    });

    socket.off("end_round");
    socket.on("end_round", ({ room, roomId }) => {
      set(() => ({
        currentCardonTable: [...room.currentCard],
      }));
    });

    socket.off("room_reset");
    socket.on("room_reset", () => {
      set({
        cards: [],
        isStart: 0,
        round: 0,
        pot: 0,
        smallBlind: null,
        bigBlind: null,
        currentCardonTable: [],
        blindsPosted: false,
        playersCard: [],
        showdown: false,
        finish: 0,

        turnPlayerId: null,
        currentBet: 0,
        players: [],
        result: null,
      });
    });

    socket.off("next_round");
    socket.on("next_round", ({ roomId, round }) => {
      set({ round: round });
    });

    socket.off("cards_updated");
    socket.on("cards_updated", ({ playerId, name, hand }) => {
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
      set({ cards });
      socket.emit("round_effect_start", { roomId, round });
    });

    socket.off("update_state");
    socket.on("update_state", ({ currentBet, turnPlayerId, players }) => {
      set({
        currentBet,
        turnPlayerId,
        players,
      });
    });

    socket.off("player_update");
    socket.on("player_update", (updatedPlayer) => {
      useAuthStore.setState({ authPlayer: updatedPlayer });
      console.log("called 2");
      console.log("Updated authPlayer:", useAuthStore.getState().authPlayer);
    });

    socket.off("leave_cards");
    socket.on("leave_cards", ({ playerId }) => {
      set((state) => ({
        cards: state.cards.filter((p) => p.playerId !== playerId),
      }));
    });
  },
}));
