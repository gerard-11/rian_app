import { createContext } from "react";

export type ThemeMode = "light" | "dark";

export type ThemeContextValue = {
  isDarkMode: boolean;
  theme: ThemeMode;
  toggleTheme: () => void;
};

export const THEME_STORAGE_KEY = "rian-theme";

export const ThemeContext = createContext<ThemeContextValue | undefined>(
  undefined,
);
