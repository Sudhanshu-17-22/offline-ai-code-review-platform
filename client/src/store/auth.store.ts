import { create } from "zustand";
import { AuthUser } from "@/types";

interface AuthState {
  user: AuthUser | null;
  token: string | null;
  isAuthenticated: boolean;
  setAuth: (user: AuthUser, token: string) => void;
  clearAuth: () => void;
  hydrate: () => void;
}

export const AuthStore = create<AuthState>((set) => (
    {
        user: null,
        token: null,
        isAuthenticated: false,

        setAuth: (user, token) => {
            localStorage.setItem("token", token);
            localStorage.setItem("user", JSON.stringify(user));
            set({ user, token, isAuthenticated: true });
        },

        clearAuth: () => {
            localStorage.removeItem("token");
            localStorage.removeItem("user");
            set({ user: null, token: null, isAuthenticated: false });
        },

        hydrate: () => {
            const token = localStorage.getItem("token");
            const userStr = localStorage.getItem("user");
            if (token && userStr) {
            set({ user: JSON.parse(userStr), token, isAuthenticated: true });
            }
        },
    }
));


