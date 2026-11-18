import { useEffect } from "react";
import { useTheme } from "./useTheme";

// Aplica el tema guardado (claro/oscuro) al documento. Solo se usa dentro del
// panel autenticado; al salir del panel se vuelve al modo claro, así el login
// y el catálogo público nunca se ven en modo oscuro.
export const useApplyTheme = () => {
  const { theme } = useTheme();

  useEffect(() => {
    const root = document.documentElement;
    root.dataset.theme = theme;
    root.style.colorScheme = theme;

    return () => {
      root.dataset.theme = "light";
      root.style.colorScheme = "light";
    };
  }, [theme]);
};
