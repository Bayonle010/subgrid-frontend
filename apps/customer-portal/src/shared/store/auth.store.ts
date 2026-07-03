import { Profile } from "@/features/auth/types/auth.type";
import { create } from "zustand";
import { persist } from "zustand/middleware";

interface AuthUser {
  access_token: string;
  token_type: string;
  must_change_password: boolean;
  userInfo?: Profile;
}

interface AuthState {
  user: AuthUser | null;
  setAuth: (data: AuthUser) => void;
  clearAuth: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      setAuth: (data) => set({ user: data }),
      clearAuth: () => set({ user: null }),
    }),
    {
      name: "auth-store",
    },
  ),
);
