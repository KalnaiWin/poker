import { create } from "zustand";
import { axiosInstance } from "../lib/axios";
import toast from "react-hot-toast";

export const useRoomStore = create((set) => ({
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
      toast.error(error.response.data.message || "Create failed");
      set({ room: null });
    } finally {
      set({ isPendingFunction: false });
    }
  },

  deleteRoom: async (roomId) => {
    set({ isDeleting: true });
    try {
      await axiosInstance.delete(`/room/delete/${roomId}`);
      set((state) => ({
        room: state.room.filter((r) => r._id !== roomId),
      }));
      toast.success("Deleted successfully");
    } catch (error) {
      console.error("Error in deleting room:", error);
      toast.error(error.response?.data?.message || "Delete failed");
    } finally {
      set({ isDeleting: false });
    }
  },

  joinRoom: async (password, roomId) => {
    set({ isPendingFunction: true });
    try {
      await axiosInstance.post(`/room/join/${roomId}`, {
        password,
      });
      toast.success("Joined room successfully");
      return 1;
    } catch (error) {
      console.error("Error in joining room:", error);
      toast.error(error.response?.data?.message || "Join failed");
      return 0;
    } finally {
      set({ isPendingFunction: false });
    }
  },

  leaveRoom: async (roomId) => {
    set({ isPendingFunction: true });
    try {
      await axiosInstance.post(`/room/leave/${roomId}`);
      toast.success("Left room successfully");
    } catch (error) {
      console.error("Error in leaving room:", error);
      toast.error(error.response?.data?.message || "Leave failed");
    } finally {
      set({ isPendingFunction: false });
    }
  },

  kickPlayer: async (playerId, roomId) => {
    set({ isPendingFunction: true });
    try {
      await axiosInstance.post(`/room/kick/${roomId}`, {
        playerId,
      });
      toast.success("Player kicked successfully");
      const res = await axiosInstance.get("/room");
      set({ room: res.data });
    } catch (error) {
      console.error("Error kicking player:", error);
      toast.error(error.response?.data?.message || "Failed to kick player");
    } finally {
      set({ isPendingFunction: false });
    }
  },

}));
