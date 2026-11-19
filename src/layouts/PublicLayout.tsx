import { Clock, MapPin, Menu, MessageCircle, Phone, UserRound, X } from "lucide-react";
import { useEffect, useState } from "react";
import { Link, NavLink, Outlet, useLocation } from "react-router-dom";
import { GENERAL_WHATSAPP_URL } from "../features/tires/tireWhatsapp";
import { WhatsappButton } from "../features/tires/WhatsappButton";
import {
  ADDRESS_ONE_LINE,
  BUSINESS,
  CLOSED_LABEL,
  LOGO_LIGHT_URL,
  LOGO_URL,
  MAPS_URL,
  OPENING_HOURS,
} from "../site/siteConfig";

const HOURS_SHORT = OPENING_HOURS.map((slot) => `${slot.shortLabel} ${slot.time}`).join(" · ");

const NAV_LINKS = [
  { to: "/", label: "Inicio" },
  { to: "/alineacion-y-balanceo", label: "Alineación y balanceo" },
  { to: "/mecanica", label: "Mecánica" },
  { to: "/llantas", label: "Llantas" },
  { to: "/contacto", label: "Contacto" },
];

const navLinkClass = ({ isActive }: { isActive: boolean }) =>
  `rounded-md px-3 py-2 text-sm font-bold transition hover:bg-slate-100 hover:text-brand-red-dark ${
    isActive ? "text-brand-red-dark" : "text-brand-ink"
  }`;

// Layout del sitio público (landing, servicios, catálogo de llantas).
export function PublicLayout() {
  const [menuOpen, setMenuOpen] = useState(false);
  const { pathname } = useLocation();

  // Al cambiar de página: cerrar el menú móvil y subir al inicio.
  useEffect(() => {
    setMenuOpen(false);
    window.scrollTo(0, 0);
  }, [pathname]);

  return (
    <div className="flex min-h-screen flex-col bg-white text-brand-ink">
      <a
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded-md focus:bg-white focus:px-4 focus:py-2 focus:font-bold"
        href="#contenido"
      >
        Saltar al contenido
      </a>

      <div className="hidden bg-brand-ink text-xs text-white/80 md:block">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-2">
          <a className="flex items-center gap-1.5 hover:text-white" href={MAPS_URL} rel="noopener noreferrer" target="_blank">
            <MapPin className="h-3.5 w-3.5" />
            {ADDRESS_ONE_LINE}
          </a>
          <div className="flex items-center gap-5">
            <span className="hidden items-center gap-1.5 lg:flex">
              <Clock className="h-3.5 w-3.5" />
              {HOURS_SHORT}
            </span>
            <a className="flex items-center gap-1.5 font-semibold hover:text-white" href={BUSINESS.landlineHref}>
              <Phone className="h-3.5 w-3.5" />
              {BUSINESS.landlineDisplay}
            </a>
          </div>
        </div>
      </div>

      <header className="sticky top-0 z-30 border-b border-slate-200 bg-white/95 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-2">
          <Link aria-label="Rian Automotriz, ir al inicio" className="shrink-0" to="/">
            <img
              alt="Rian Automotriz - Alineación y balanceo"
              className="h-12 w-auto md:h-16"
              height={64}
              src={LOGO_URL}
              width={151}
            />
          </Link>

          <nav aria-label="Principal" className="hidden items-center gap-1 lg:flex">
            {NAV_LINKS.map((link) => (
              <NavLink className={navLinkClass} end={link.to === "/"} key={link.to} to={link.to}>
                {link.label}
              </NavLink>
            ))}
          </nav>

          <div className="flex items-center gap-2">
            <div className="hidden sm:block">
              <WhatsappButton href={GENERAL_WHATSAPP_URL} size="md">
                WhatsApp
              </WhatsappButton>
            </div>
            <button
              aria-controls="menu-movil"
              aria-expanded={menuOpen}
              aria-label={menuOpen ? "Cerrar menú" : "Abrir menú"}
              className="flex h-11 w-11 items-center justify-center rounded-md text-brand-ink hover:bg-slate-100 lg:hidden"
              onClick={() => setMenuOpen((open) => !open)}
              type="button"
            >
              {menuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {menuOpen ? (
          <nav aria-label="Principal" className="border-t border-slate-200 bg-white lg:hidden" id="menu-movil">
            <div className="mx-auto flex max-w-6xl flex-col px-4 py-2">
              {NAV_LINKS.map((link) => (
                <NavLink className={navLinkClass} end={link.to === "/"} key={link.to} to={link.to}>
                  {link.label}
                </NavLink>
              ))}
              <a className="mt-1 flex items-center gap-2 rounded-md px-3 py-2 text-sm font-bold text-brand-sky-dark" href={BUSINESS.landlineHref}>
                <Phone className="h-4 w-4" />
                Llamar al {BUSINESS.landlineDisplay}
              </a>
              <p className="flex items-center gap-2 px-3 py-2 text-xs text-slate-500">
                <Clock className="h-4 w-4" />
                {HOURS_SHORT}
              </p>
            </div>
          </nav>
        ) : null}
        <div className="h-1 bg-gradient-to-r from-brand-red via-brand-red to-brand-sky" />
      </header>

      <main className="flex-1" id="contenido">
        <Outlet />
      </main>

      <footer className="bg-brand-ink-dark text-white">
        <div className="h-1 bg-brand-red" />
        <div className="mx-auto grid max-w-6xl gap-8 px-4 py-10 md:grid-cols-3">
          <div>
            <img alt="Rian Automotriz" className="h-14 w-auto" height={56} loading="lazy" src={LOGO_LIGHT_URL} width={132} />
            <p className="mt-3 text-sm text-white/70">{BUSINESS.tagline}.</p>
          </div>

          <address className="not-italic">
            <p className="text-sm font-black uppercase tracking-wider text-white">Visítanos</p>
            <a className="mt-3 flex gap-2 text-sm text-white/70 hover:text-white" href={MAPS_URL} rel="noopener noreferrer" target="_blank">
              <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-brand-red" />
              {ADDRESS_ONE_LINE}
            </a>
            <a className="mt-2 flex items-center gap-2 text-sm text-white/70 hover:text-white" href={BUSINESS.landlineHref}>
              <Phone className="h-4 w-4 shrink-0 text-brand-red" />
              Fijo: {BUSINESS.landlineDisplay}
            </a>
            <a className="mt-2 flex items-center gap-2 text-sm text-white/70 hover:text-white" href={GENERAL_WHATSAPP_URL} rel="noopener noreferrer" target="_blank">
              <MessageCircle className="h-4 w-4 shrink-0 text-whatsapp" />
              Celular / WhatsApp: {BUSINESS.phoneDisplay}
            </a>
            <div className="mt-4 flex gap-2 text-sm text-white/70">
              <Clock className="mt-0.5 h-4 w-4 shrink-0 text-brand-sky" />
              <ul>
                {OPENING_HOURS.map((slot) => (
                  <li key={slot.label}>
                    {slot.label}: {slot.time}
                  </li>
                ))}
                <li>{CLOSED_LABEL}</li>
              </ul>
            </div>
          </address>

          <nav aria-label="Pie de página">
            <p className="text-sm font-black uppercase tracking-wider text-white">Servicios</p>
            <ul className="mt-3 space-y-2 text-sm text-white/70">
              {NAV_LINKS.slice(1).map((link) => (
                <li key={link.to}>
                  <Link className="hover:text-white" to={link.to}>
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>
        <div className="border-t border-white/10">
          <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-2 px-4 py-4 text-xs text-white/50">
            <p>© {BUSINESS.name}. Todos los derechos reservados.</p>
            <Link className="inline-flex items-center gap-1.5 hover:text-white" rel="nofollow" to="/login">
              <UserRound className="h-3.5 w-3.5" />
              Acceso personal
            </Link>
          </div>
        </div>
      </footer>

      <a
        aria-label="Escríbenos por WhatsApp"
        className="fixed bottom-5 right-5 z-30 flex h-14 w-14 items-center justify-center rounded-full bg-whatsapp text-white shadow-xl shadow-whatsapp/30 transition hover:scale-105 hover:bg-whatsapp-dark focus:outline-none focus:ring-4 focus:ring-whatsapp/30 sm:hidden"
        href={GENERAL_WHATSAPP_URL}
        rel="noopener noreferrer"
        target="_blank"
      >
        <MessageCircle className="h-7 w-7" />
      </a>
    </div>
  );
}
