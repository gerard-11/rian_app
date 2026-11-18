import { RefreshCw, X } from "lucide-react";
import { useLocation } from "react-router-dom";
import { useRegisterSW } from "virtual:pwa-register/react";

// Cada cuánto se pregunta al servidor si hay un deploy nuevo, aunque la app siga abierta.
const UPDATE_CHECK_INTERVAL_MS = 10 * 60 * 1000;

// Páginas públicas: ahí no se muestra el aviso; la versión nueva se activa
// sola la próxima vez que el cliente abra el sitio.
const isPublicPath = (pathname: string) =>
  pathname === "/" || pathname === "/login" || pathname.startsWith("/catalog");

// Registra el service worker y avisa al personal cuando hay una versión nueva.
export function UpdatePrompt() {
  const { pathname } = useLocation();
  const {
    needRefresh: [needRefresh, setNeedRefresh],
    updateServiceWorker,
  } = useRegisterSW({
    onRegisteredSW(_url, registration) {
      if (!registration) return;

      setInterval(() => {
        if (navigator.onLine && document.visibilityState === "visible") {
          void registration.update();
        }
      }, UPDATE_CHECK_INTERVAL_MS);
    },
  });

  if (!needRefresh || isPublicPath(pathname)) return null;

  return (
    <div
      aria-live="polite"
      className="fixed inset-x-4 bottom-4 z-[70] mx-auto flex max-w-md items-center gap-3 rounded-xl border border-slate-700 bg-slate-900 px-4 py-3 text-sm text-white shadow-2xl"
      role="status"
    >
      <RefreshCw className="h-5 w-5 shrink-0 text-blue-300" />
      <p className="flex-1">Hay una nueva versión disponible.</p>
      <button
        className="rounded-lg bg-blue-600 px-3 py-1.5 font-semibold transition hover:bg-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-300"
        onClick={() => void updateServiceWorker(true)}
        type="button"
      >
        Actualizar
      </button>
      <button
        aria-label="Recordar después"
        className="rounded-lg p-1.5 text-white/60 transition hover:bg-white/10 hover:text-white focus:outline-none focus:ring-2 focus:ring-white/40"
        onClick={() => setNeedRefresh(false)}
        type="button"
      >
        <X className="h-4 w-4" />
      </button>
    </div>
  );
}
