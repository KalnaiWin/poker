import { create } from "zustand";
import { axiosInstance } from "../lib/axios";

export const useMessageStore = create((set) => ({
  allMessage: null,
  isSending: false,
  isLoadingMessage: false,

  getMessage: async (roomId) => {
    set({ isLoadingMessage: true });
    try {
      const res = await axiosInstance.get(`/message/${roomId}`);
      set({ allMessage: res.data });
      return 1;
    } catch (error) {
      console.error("Error in chat message", error);
      set({ allMessage: null });
      return 0;
    } finally {
      set({ isLoadingMessage: false });
    }
  },

  sendMessage: async (data) => {
    set({ isSending: true });
    try {
      const res = await axiosInstance.post("/message", data);
      set({ allMessage: res.data });
      return 1;
    } catch (error) {
      console.error("Error in sending messgae", error);
      set({ allMessage: null });
      return 0;
    } finally {
      set({ isSending: false });
    }
  },

  replyMessage: async (data) => {
    set({ isSending: true });
    try {
      const res = await axiosInstance.post("/message/reply", data);
      set({ allMessage: res.data });
      return 1;
    } catch (error) {
      console.error("Error in reply messgae", error);
      set({ allMessage: null });
      return 0;
    } finally {
      set({ isSending: false });
    }
  },
}));
