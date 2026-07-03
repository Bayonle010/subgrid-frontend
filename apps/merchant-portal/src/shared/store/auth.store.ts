import { AuthTokenUser, MerchantProfile } from "@/features/auth/types/auth.type";
import { create } from "zustand";
import { persist } from "zustand/middleware";

interface AuthUser {
  accessToken: string;
  refreshToken: string;
  tokenType: string;
  tenantId: string;
  user: AuthTokenUser;
  profile?: MerchantProfile;
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
