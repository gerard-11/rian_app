import { MessageCircle, UserRound } from "lucide-react";
import { Link, Outlet } from "react-router-dom";
import logoRian from "../assets/logo-rian.jpeg";
import { GENERAL_WHATSAPP_URL } from "../features/tires/tireWhatsapp";
import { WhatsappButton } from "../features/tires/WhatsappButton";

// Layout de las páginas sin login (catálogo público).
export function PublicLayout() {
  return (
    <div className="flex min-h-screen flex-col bg-slate-50 text-slate-950">
      <header className="sticky top-0 z-20 border-b border-slate-200 bg-white/95 backdrop-blur">
        <div className="h-1 bg-gradient-to-r from-[#B3262D] via-[#B3262D] to-[#1D4ED8]" />
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-2 md:py-3">
          <Link aria-label="Rian Automotriz, inicio del catálogo" to="/">
            <img
              alt="Rian Automotriz - Alineación y balanceo"
              className="h-14 w-auto mix-blend-multiply md:h-24"
              height={96}
              src={logoRian}
              width={226}
            />
          </Link>
          <div className="hidden sm:block">
            <WhatsappButton href={GENERAL_WHATSAPP_URL} size="lg">
              Escríbenos por WhatsApp
            </WhatsappButton>
          </div>
        </div>
      </header>

      <main className="mx-auto w-full max-w-6xl flex-1 px-4 pb-24 pt-5 md:pt-8">
        <Outlet />
      </main>

      <footer className="border-t border-slate-200 bg-white text-slate-950">
        <div className="h-1 bg-gradient-to-r from-[#B3262D] via-[#B3262D] to-[#1D4ED8]" />
        <div className="mx-auto max-w-6xl px-4 py-6 text-sm">
          <p className="font-bold">Rian Automotriz</p>
          <p className="mt-1 text-slate-600">Llantas, alineación y balanceo.</p>
          <Link
            className="mt-4 inline-flex items-center gap-1.5 text-xs text-slate-400 transition hover:text-slate-700 focus:text-slate-700 focus:outline-none"
            to="/login"
          >
            <UserRound className="h-3.5 w-3.5" />
            Acceso personal
          </Link>
        </div>
      </footer>

      <a
        aria-label="Escríbenos por WhatsApp"
        className="fixed bottom-5 right-5 z-30 flex h-14 w-14 items-center justify-center rounded-full bg-[#1FAF54] text-white shadow-xl shadow-[#1FAF54]/30 transition hover:scale-105 hover:bg-[#178A42] focus:outline-none focus:ring-4 focus:ring-[#1FAF54]/30 sm:hidden"
        href={GENERAL_WHATSAPP_URL}
        rel="noopener noreferrer"
        target="_blank"
      >
        <MessageCircle className="h-7 w-7" />
      </a>
    </div>
  );
}
