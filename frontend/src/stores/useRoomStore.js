import { create } from "zustand";
import { axiosInstance } from "../lib/axios";
import toast from "react-hot-toast";
import { useMessageStore } from "./useChatStore";
import { useAuthStore } from "./useAuthStore";
import { usePokerStore } from "./usePokerStore";

export const useRoomStore = create((set, get) => ({
  room: null,
  isLoadingRoom: false,
  isPendingFunction: false,
  isDeletingRoom: false,

  getAllRoom: async () => {
    set({ isLoadingRoom: true });
    try {
      const res = await axiosInstance.get("/room");
      set({ room: res.data });
    } catch (error) {
      console.error("Error in room", error);
      toast.error(error?.response?.data?.message || "Failed to load rooms");
      set({ room: null });
    } finally {
      set({ isLoadingRoom: false });
    }
  },

  createRoom: async (data) => {
    set({ isPendingFunction: true });
    try {
      await axiosInstance.post("/room/create", data);
      toast.success("Create room successfully");
      const res = await axiosInstance.get("/room");
      set({ room: res.data });
    } catch (error) {
      console.error("Error in creating room", error);
      toast.error(error?.response?.data?.message || "Create failed");
    } finally {
      set({ isPendingFunction: false });
    }
  },

  deleteRoom: async (roomId) => {
    set({ isDeletingRoom: true });
    try {
      await axiosInstance.delete(`/room/delete/${roomId}`);
      set((state) => ({
        room: state.room.filter((r) => r._id !== roomId),
      }));
      toast.success("Deleted successfully");
    } catch (error) {
      console.error("Error in deleting room:", error);
      toast.error(error?.response?.data?.message || "Delete failed");
    } finally {
      set({ isDeletingRoom: false });
    }
  },

  joinRoom: async (password, roomId) => {
    set({ isPendingFunction: true });
    const { authPlayer, socket } = useAuthStore.getState();
    try {
      await axiosInstance.post(`/room/join/${roomId}`, { password });
      if (socket && authPlayer?._id) {
        socket.emit("join_room", {
          roomId,
          playerId: authPlayer._id,
          playerName: authPlayer.name,
        });
        useMessageStore.getState().sendMessage(" joined the room", roomId);
      }
      await get().getAllRoom();
      console.log("join room");
      return 1;
    } catch (error) {
      console.error("Error in joining room:", error);
      toast.error(error?.response?.data?.message || "Join failed");
      return 0;
    } finally {
      set({ isPendingFunction: false });
    }
  },

  leaveRoom: async (roomId) => {
    set({ isPendingFunction: true });
    const { authPlayer, socket } = useAuthStore.getState();
    try {
      await axiosInstance.post(`/room/leave/${roomId}`);
      if (socket && authPlayer?._id) {
        socket.emit("leave_room", { roomId, playerId: authPlayer._id });
        useMessageStore.getState().sendMessage(" left the room", roomId);
        socket.off("player_left_room");
        socket.on("player_left_room", { roomId, playerId: authPlayer._id });
      }
      await axiosInstance.delete(`/message/${roomId}/reset`);
      await get().getAllRoom();
      usePokerStore.getState().isStart = 0;
      usePokerStore.getState().resetGame?.();
      const res = await axiosInstance.get("/room");
      console.log("leave room");
      set({ room: res.data });
    } catch (error) {
      console.error("Error in leaving room:", error);
      toast.error(error?.response?.data?.message || "Leave failed");
    } finally {
      set({ isPendingFunction: false });
    }
  },

  kickPlayer: async (playerId, roomId) => {
    set({ isPendingFunction: true });
    const { socket } = useAuthStore.getState();
    try {
      await axiosInstance.post(`/room/kick/${roomId}`, { playerId });

      if (socket) {
        socket.emit("kick_player", { roomId, playerId });
      }
      toast.success("Player kicked successfully");
      const res = await axiosInstance.get("/room");
      set({ room: res.data });
    } catch (error) {
      console.error("Error kicking player:", error);
      toast.error(error?.response?.data?.message || "Failed to kick player");
    } finally {
      set({ isPendingFunction: false });
    }
  },
}));
