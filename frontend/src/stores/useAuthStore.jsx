import { create } from "zustand";
import { axiosInstance } from "../lib/axios";
import toast from "react-hot-toast";

export const useAuthStore = create((set) => ({
  authPlayer: null,
  isCheckingAuth: true,
  isAuthLoading: false,

  checkAuth: async () => {
    try {
      const res = await axiosInstance.get("/auth/check");
      set({ authPlayer: res.data });
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
    } catch (error) {
      toast.error(error.response?.data?.message || "Logout failed");
    }
  },
}));
