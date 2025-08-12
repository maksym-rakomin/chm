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
    try {
      const res = await fetch("/api/me/role", { cache: "no-store" });
      if (!res.ok) throw new Error("failed");
      const data = (await res.json()) as { role: UserRole };
      set({ role: data.role, isLoaded: true });
    } catch {
      set({ role: "guest", isLoaded: true });
    }
  },
}));


