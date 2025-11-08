import { create } from "zustand";
import { axiosInstance } from "../lib/axios";
import toast from "react-hot-toast";
import { io } from "socket.io-client";
import { useMessageStore } from "./useChatStore";

const BASE_URL =
  import.meta.env.MODE === "development" ? "http://localhost:8000" : "/";

export const useAuthStore = create((set, get) => ({
  authPlayer: null,
  isCheckingAuth: true,
  isAuthLoading: false,

  socket: null,
  onlineUsers: [],

  checkAuth: async () => {
    try {
      const res = await axiosInstance.get("/auth/check");
      set({ authPlayer: res.data });
      get().connectSocket();
    } catch (error) {
      console.error("Error in authPlayer", error);
      set({ authPlayer: null });
    } finally {
      set({ isCheckingAuth: false });
    }
  },

  signup: async (data) => {
    set({ isAuthLoading: true });
    try {
      const res = await axiosInstance.post("/auth/signup", data);
      set({ authPlayer: res.data });
      toast.success("Account created successfully");
      get().connectSocket();
    } catch (error) {
      toast.error(error.response.data.message || "Signup failed");
    } finally {
      set({ isAuthLoading: false });
    }
  },

  login: async (data) => {
    set({ isAuthLoading: true });
    try {
      const res = await axiosInstance.post("/auth/login", data);
      set({ authPlayer: res.data });
      toast.success("Access account successfully");
      get().connectSocket();
    } catch (error) {
      toast.error(error.response?.data?.message || "Logout failed");
    } finally {
      set({ isAuthLoading: false });
    }
  },

  logout: async () => {
    try {
      await axiosInstance.post("/auth/logout");
      toast.success("Log out successfully");
      set({ authPlayer: null });
      get().disconnectSocket();
    } catch (error) {
      toast.error(error.response?.data?.message || "Logout failed");
    }
  },

  // call when signup or login
  connectSocket: async () => {
    const { authPlayer } = get();
    if (!authPlayer || get().socket?.connected) return;

    const socket = io(BASE_URL, {
      withCredentials: true, // this ensures cookies are sent with the connection
    });

    socket.connect();

    set({ socket: socket });

    // listen for online users event
    socket.on("getOnlineplayers", (users) => {
      set({ onlineUsers: users });
    });

    socket.on("receive_message", ({ message, roomId }) => {
      // console.log("Received real-time message:", message, "from room:", roomId);
      useMessageStore.getState().addIncomingMessage(message);
    });

    console.log("✅ Socket connected");
  },

  disconnectSocket: async () => {
    if (get().socket.connected) {
      get().socket.disconnect();
    }
  },
}));
