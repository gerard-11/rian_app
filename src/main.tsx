import { StrictMode } from "react";
import { QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter } from "react-router-dom";
import { createRoot, hydrateRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import { ProfitsAccessProvider } from "./contexts/ProfitsAccessContext";
import { ThemeProvider } from "./contexts/ThemeContext";
import { queryClient } from "./lib/queryClient";

const app = (
  <StrictMode>
    <ThemeProvider>
      <ProfitsAccessProvider>
        <QueryClientProvider client={queryClient}>
          <BrowserRouter>
            <App />
          </BrowserRouter>
        </QueryClientProvider>
      </ProfitsAccessProvider>
    </ThemeProvider>
  </StrictMode>
);

const container = document.getElementById("root")!;
const normalizePath = (path: string) => path.replace(/\/+$/, "") || "/";

// Las páginas públicas llegan pre-renderizadas (scripts/prerender.mjs): el
// HTML ya se ve antes de que cargue el JS y React solo lo "hidrata". Si el
// HTML no corresponde a esta ruta (p. ej. el CRM), se renderiza desde cero.
if (container.dataset.prerendered && normalizePath(container.dataset.prerendered) === normalizePath(window.location.pathname)) {
  hydrateRoot(container, app);
} else {
  container.replaceChildren();
  createRoot(container).render(app);
}
