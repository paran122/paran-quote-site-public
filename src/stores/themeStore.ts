import { create } from "zustand";
import type { ThemeKey } from "@/lib/themes";

interface ThemeState {
  theme: ThemeKey;
  setTheme: (t: ThemeKey) => void;
}

export const useThemeStore = create<ThemeState>((set) => ({
  theme: "navy",
  setTheme: (theme) => set({ theme }),
}));
