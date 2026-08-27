import { Moon, Sun } from "lucide-react";
import { useTheme } from "../hooks/useTheme";

export function ThemeToggle() {
  const { isDarkMode, toggleTheme } = useTheme();
  const label = isDarkMode ? "Activar modo claro" : "Activar modo oscuro";

  return (
    <button
      aria-label={label}
      aria-pressed={isDarkMode}
      className="flex h-10 w-10 items-center justify-center rounded-md border border-slate-300 bg-white text-slate-700 transition hover:bg-slate-100 focus:outline-none focus:ring-2 focus:ring-[#4169e1] focus:ring-offset-2"
      onClick={toggleTheme}
      title={label}
      type="button"
    >
      {isDarkMode ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
    </button>
  );
}
