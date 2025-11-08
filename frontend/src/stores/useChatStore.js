import { create } from "zustand";
import { axiosInstance } from "../lib/axios";
import { useAuthStore } from "./useAuthStore";

export const useMessageStore = create((set, get) => ({
  isSending: false,
  isLoadingMessage: false,
  messages: [],

  getMessage: async (roomId) => {
    set({ isLoadingMessage: true });
    try {
      const res = await axiosInstance.get(`/message/${roomId}`);
      set({ messages: res.data });
      return 1;
    } catch (error) {
      console.error("Error in chat message", error);
      set({ messages: null });
      return 0;
    } finally {
      set({ isLoadingMessage: false });
    }
  },

  sendMessage: async (text, roomId) => {
    const { authPlayer, socket } = useAuthStore.getState();
    if (!text.trim() || !socket) return;
    const tempMessage = {
      _id: `temp-${Date.now()}`,
      sender: { _id: authPlayer._id, name: authPlayer.name },
      text,
      createdAt: new Date().toISOString(),
    };
    set((state) => ({ messages: [...state.messages, tempMessage] }));

    set({ isSending: true });
    try {
      const res = await axiosInstance.post(`/message/${roomId}/send`, { text });
      socket.emit("send_message", { message: res.data, roomId });
      set((state) => ({
        messages: state.messages.map((m) =>
          m._id === tempMessage._id ? res.data : m
        ),
      }));
    } catch (error) {
      set((state) => ({
        messages: state.messages.filter((m) => m._id !== tempMessage._id),
      }));
    } finally {
      set({ isSending: false });
    }
  },

  replyMessage: async (data) => {
    set({ isSending: true });
    try {
      const res = await axiosInstance.post("/message/reply", data);
      set({ messages: res.data });
      return 1;
    } catch (error) {
      console.error("Error in reply messgae", error);
      set({ messages: null });
      return 0;
    } finally {
      set({ isSending: false });
    }
  },

  clearMessages: () => {
    set({ messages: [] });
  },

  addIncomingMessage: (message) => {
    set((state) => ({
      messages: [...state.messages, message],
    }));
  },
}));
