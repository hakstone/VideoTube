import { create } from "zustand";

export const useAuth = create((set) => ({
    user: null,
    accessToken: null,
    refreshToken: null,
    isLoading: false,
    setUser: (user) => set({ user }),
    setTokens: ({ accessToken, refreshToken }) => set({ accessToken, refreshToken }),
    logout: () => set({ user: null, accessToken: null, refreshToken: null }),
}));