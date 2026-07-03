import { MerchantProfile } from "@/features/auth/types/auth.type";
import { create } from "zustand";
import { persist } from "zustand/middleware";

interface AuthUser {
  access_token: string;
  refresh_token: string;
  token_type: string;
  must_change_password: boolean;
  userInfo?: MerchantProfile;
}

interface AuthState {
  user: AuthUser | null;
  setAuth: (data: Partial<AuthUser> | ((prev: AuthUser | null) => AuthUser)) => void;
  clearAuth: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      setAuth: (data) => {
        if (typeof data === "function") {
          set({ user: data(get().user) });
        } else {
          set((state) => ({
            user: state.user ? { ...state.user, ...data } : (data as AuthUser),
          }));
        }
      },
      clearAuth: () => set({ user: null }),
    }),
    { name: "auth-store" },
  ),
);
