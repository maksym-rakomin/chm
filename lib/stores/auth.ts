"use client";

import { create } from "zustand";
import { UserRole } from "@/lib/types/roles";

type AuthState = {
  role: UserRole;
  isLoaded: boolean;
  setRole: (role: UserRole) => void;
  hydrateFromServer: () => Promise<void>;
};

export const useAuthStore = create<AuthState>((set) => ({
  role: "guest",
  isLoaded: false,
  setRole: (role) => set({ role }),
  hydrateFromServer: async () => {
    // Static export: there is no API available at runtime. Default to "guest".
    set({ role: "guest", isLoaded: true });
  },
}));


