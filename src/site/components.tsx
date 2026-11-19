import { ArrowRight, CircleCheck, Clock, MapPin, MessageCircle, Phone } from "lucide-react";
import type { ReactNode } from "react";
import { Link } from "react-router-dom";
import { buildWhatsappUrl } from "../features/tires/tireWhatsapp";
import { WhatsappButton } from "../features/tires/WhatsappButton";
import type { ServiceGroup } from "./services";
import { ADDRESS_ONE_LINE, BUSINESS, MAPS_EMBED_URL, MAPS_URL, OPENING_HOURS, SHOP_PHOTOS } from "./siteConfig";

export function Container({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <div className={`mx-auto w-full max-w-6xl px-4 ${className}`}>{children}</div>;
}

// Franjas diagonales como las del logo; decoración pura.
function SpeedStripes({ className = "" }: { className?: string }) {
  return (
    <div aria-hidden="true" className={`pointer-events-none flex gap-2 ${className}`}>
      {Array.from({ length: 8 }, (_, index) => (
        <span className="h-full w-2 -skew-x-[30deg] bg-current" key={index} />
      ))}
    </div>
  );
}

export function Eyebrow({ children, tone = "light" }: { children: ReactNode; tone?: "light" | "dark" }) {
  return (
    <p
      className={`inline-flex items-center gap-2 text-xs font-black uppercase tracking-[0.2em] ${
        tone === "dark" ? "text-brand-sky" : "text-brand-red-dark"
      }`}
    >
      <span className="h-0.5 w-6 bg-current" />
      {children}
    </p>
  );
}

export function SectionHeading({
  eyebrow,
  title,
  children,
  as: Heading = "h2",
}: {
  eyebrow: string;
  title: ReactNode;
  children?: ReactNode;
  as?: "h1" | "h2";
}) {
  return (
    <div className="max-w-2xl">
      <Eyebrow>{eyebrow}</Eyebrow>
      <Heading className="mt-2 text-3xl font-black uppercase italic leading-tight tracking-tight text-brand-ink md:text-4xl">
        {title}
      </Heading>
      {children ? <p className="mt-3 text-base text-slate-600 md:text-lg">{children}</p> : null}
    </div>
  );
}

export function CallButton({ className = "", tone = "light" }: { className?: string; tone?: "light" | "dark" }) {
  return (
    <a
      className={`inline-flex h-12 items-center justify-center gap-2 rounded-md border-2 px-5 text-base font-bold transition focus:outline-none focus:ring-4 ${
        tone === "dark"
          ? "border-white/40 text-white hover:border-white hover:bg-white/10 focus:ring-white/30"
          : "border-brand-ink text-brand-ink hover:bg-brand-ink hover:text-white focus:ring-brand-ink/20"
      } ${className}`}
      href={BUSINESS.landlineHref}
    >
      <Phone className="h-5 w-5" />
      Llamar {BUSINESS.landlineDisplay}
    </a>
  );
}

/** Encabezado de las páginas de servicio. */
export function PageHero({
  eyebrow,
  title,
  description,
  whatsappText,
  aside,
}: {
  eyebrow: string;
  title: string;
  description: string;
  whatsappText: string;
  aside?: ReactNode;
}) {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-brand-ice/70 via-white to-brand-ice/40 text-brand-ink">
      <SpeedStripes className="absolute -right-6 top-0 h-full text-brand-sky/15" />
      <div className="absolute inset-y-0 left-0 w-1.5 bg-brand-red" />
      <Container className="relative grid items-center gap-8 py-12 md:grid-cols-[1.4fr_1fr] md:py-16">
        <div>
          <Eyebrow>{eyebrow}</Eyebrow>
          <h1 className="mt-3 text-4xl font-black uppercase italic leading-[1.05] tracking-tight md:text-5xl">{title}</h1>
          <p className="mt-4 max-w-xl text-base text-slate-600 md:text-lg">{description}</p>
          <div className="mt-6 flex flex-col gap-3 sm:flex-row">
            <WhatsappButton href={buildWhatsappUrl(whatsappText)} size="lg">
              Cotizar por WhatsApp
            </WhatsappButton>
            <CallButton />
          </div>
        </div>
        {aside}
      </Container>
    </section>
  );
}

export function SignsList({ signs }: { signs: string[] }) {
  return (
    <ul className="grid gap-3">
      {signs.map((sign) => (
        <li className="flex gap-3 text-slate-700" key={sign}>
          <CircleCheck className="mt-0.5 h-5 w-5 shrink-0 text-brand-red" />
          <span>{sign}</span>
        </li>
      ))}
    </ul>
  );
}

export function ServiceGroupBlock({ group, headingLevel = "h2" }: { group: ServiceGroup; headingLevel?: "h2" | "h3" }) {
  const Heading = headingLevel;
  return (
    <article className="scroll-mt-28 rounded-lg border border-slate-200 bg-white p-5 shadow-sm md:p-8" id={group.id}>
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="max-w-2xl">
          <Heading className="text-2xl font-black uppercase italic text-brand-ink md:text-3xl">{group.title}</Heading>
          <p className="mt-2 text-slate-600">{group.summary}</p>
        </div>
        <WhatsappButton href={buildWhatsappUrl(group.whatsappText)} size="md" variant="outline">
          Cotizar
        </WhatsappButton>
      </div>

      <div className="mt-6 grid gap-6 md:grid-cols-2">
        <div className="grid gap-3">
          {group.items.map((item) => (
            <div className="rounded-md border-l-4 border-brand-red bg-slate-50 px-4 py-3" key={item.id}>
              <h3 className="font-black text-brand-ink">{item.name}</h3>
              <p className="mt-1 text-sm text-slate-600">{item.description}</p>
            </div>
          ))}
        </div>
        <div>
          <p className="text-sm font-black uppercase tracking-wider text-slate-500">¿Cuándo revisarlo?</p>
          <div className="mt-3">
            <SignsList signs={group.signs} />
          </div>
        </div>
      </div>
    </article>
  );
}

const SHOP_HIGHLIGHTS = [
  "Elevadores para revisar tu auto por debajo.",
  "Equipo para alineación y balanceo.",
  "Área de trabajo techada sobre la carretera federal.",
];

export function ShopSection() {
  return (
    <section className="overflow-hidden bg-brand-ink py-14 text-white md:py-20">
      <Container className="grid items-center gap-10 md:grid-cols-[1fr_1.2fr]">
        <div>
          <Eyebrow tone="dark">Nuestro taller</Eyebrow>
          <h2 className="mt-2 text-3xl font-black uppercase italic leading-tight tracking-tight md:text-4xl">
            El equipo para hacerlo bien
          </h2>
          <p className="mt-3 text-white/75 md:text-lg">
            Trabajamos con tu auto en elevador para revisar frenos, suspensión y dirección de cerca, y te mostramos lo
            que encontramos antes de cambiar cualquier pieza.
          </p>
          <ul className="mt-6 grid gap-3">
            {SHOP_HIGHLIGHTS.map((item) => (
              <li className="flex gap-3 text-white/85" key={item}>
                <CircleCheck className="mt-0.5 h-5 w-5 shrink-0 text-brand-sky" />
                {item}
              </li>
            ))}
          </ul>
        </div>

        <div className="grid grid-cols-2 gap-3 md:gap-4">
          <img
            alt="Área de trabajo de Rian Automotriz con elevadores y equipo de alineación"
            className="aspect-[3/4] w-full rounded-lg object-cover shadow-xl"
            height={853}
            loading="lazy"
            src={SHOP_PHOTOS.lifts}
            width={640}
          />
          <img
            alt="Camioneta en elevador durante un servicio en Rian Automotriz"
            className="mt-8 aspect-[3/4] w-full rounded-lg object-cover shadow-xl md:mt-12"
            height={853}
            loading="lazy"
            src={SHOP_PHOTOS.service}
            width={640}
          />
        </div>
      </Container>
    </section>
  );
}

export function LocationSection({ headingLevel = "h2" }: { headingLevel?: "h1" | "h2" }) {
  return (
    <section className="bg-brand-ice/40 py-14 md:py-20" id="ubicacion">
      <Container className="grid gap-8 md:grid-cols-2">
        <div>
          <SectionHeading as={headingLevel} eyebrow="Ubicación" title="Visítanos en el taller">
            Estamos sobre la carretera federal México-Puebla, en San Matías Tlalancaleca.
          </SectionHeading>

          {headingLevel === "h1" ? (
            <figure className="mt-6">
              <img
                alt={`Fachada de ${BUSINESS.name}: búscanos por el letrero rojo con negro`}
                className="aspect-video w-full rounded-lg object-cover shadow-sm"
                fetchPriority="high"
                height={432}
                src={SHOP_PHOTOS.facade}
                width={768}
              />
              <figcaption className="mt-2 text-sm text-slate-600">Así nos ves desde la carretera.</figcaption>
            </figure>
          ) : null}

          <address className="mt-6 grid gap-3 not-italic">
            <a
              className="flex gap-3 rounded-md border border-slate-200 bg-white p-4 shadow-sm transition hover:border-brand-sky-dark/40"
              href={MAPS_URL}
              rel="noopener noreferrer"
              target="_blank"
            >
              <MapPin className="mt-0.5 h-5 w-5 shrink-0 text-brand-red" />
              <span>
                <span className="block font-bold text-brand-ink">{ADDRESS_ONE_LINE}</span>
                <span className="mt-1 inline-flex items-center gap-1 text-sm font-semibold text-brand-sky-dark">
                  Cómo llegar <ArrowRight className="h-4 w-4" />
                </span>
              </span>
            </a>
            <a
              className="flex items-center gap-3 rounded-md border border-slate-200 bg-white p-4 shadow-sm transition hover:border-brand-sky-dark/40"
              href={BUSINESS.landlineHref}
            >
              <Phone className="h-5 w-5 shrink-0 text-brand-red" />
              <span>
                <span className="block text-xs font-semibold uppercase tracking-wider text-slate-500">Teléfono fijo</span>
                <span className="font-bold text-brand-ink">{BUSINESS.landlineDisplay}</span>
              </span>
            </a>
            <a
              className="flex items-center gap-3 rounded-md border border-slate-200 bg-white p-4 shadow-sm transition hover:border-whatsapp/50"
              href={buildWhatsappUrl("Hola, quiero información de sus servicios.")}
              rel="noopener noreferrer"
              target="_blank"
            >
              <MessageCircle className="h-5 w-5 shrink-0 text-whatsapp" />
              <span>
                <span className="block text-xs font-semibold uppercase tracking-wider text-slate-500">Celular / WhatsApp</span>
                <span className="font-bold text-brand-ink">{BUSINESS.phoneDisplay}</span>
              </span>
            </a>
            <div className="flex gap-3 rounded-md border border-slate-200 bg-white p-4 shadow-sm">
              <Clock className="mt-0.5 h-5 w-5 shrink-0 text-brand-sky-dark" />
              <span>
                <span className="block text-xs font-semibold uppercase tracking-wider text-slate-500">Horario</span>
                <dl className="mt-1 grid grid-cols-[auto_1fr] gap-x-4 gap-y-0.5 text-sm">
                  {OPENING_HOURS.map((slot) => (
                    <div className="contents" key={slot.label}>
                      <dt className="font-bold text-brand-ink">{slot.label}</dt>
                      <dd className="text-slate-600">{slot.time}</dd>
                    </div>
                  ))}
                  <div className="contents">
                    <dt className="font-bold text-brand-ink">Domingo</dt>
                    <dd className="text-slate-600">Cerrado</dd>
                  </div>
                </dl>
              </span>
            </div>
          </address>
        </div>

        <div className="min-h-80 overflow-hidden rounded-lg border border-slate-200 bg-slate-200 shadow-sm">
          <iframe
            allowFullScreen
            className="h-full min-h-80 w-full"
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            src={MAPS_EMBED_URL}
            title={`Mapa: ${BUSINESS.name} en ${BUSINESS.address.locality}`}
          />
        </div>
      </Container>
    </section>
  );
}

export function CtaBand({ title, text, whatsappText }: { title: string; text: string; whatsappText: string }) {
  return (
    <section className="relative overflow-hidden bg-brand-red text-white">
      <SpeedStripes className="absolute -left-4 top-0 h-full text-white/10" />
      <Container className="relative flex flex-col items-start justify-between gap-6 py-10 md:flex-row md:items-center">
        <div>
          <h2 className="text-2xl font-black uppercase italic md:text-3xl">{title}</h2>
          <p className="mt-1 text-white/85">{text}</p>
        </div>
        <div className="flex flex-col gap-3 sm:flex-row">
          <WhatsappButton href={buildWhatsappUrl(whatsappText)} size="lg">
            WhatsApp
          </WhatsappButton>
          <CallButton tone="dark" />
        </div>
      </Container>
    </section>
  );
}

export function TextLink({ to, children }: { to: string; children: ReactNode }) {
  return (
    <Link className="inline-flex items-center gap-1 font-bold text-brand-sky-dark hover:underline" to={to}>
      {children}
      <ArrowRight className="h-4 w-4" />
    </Link>
  );
}
