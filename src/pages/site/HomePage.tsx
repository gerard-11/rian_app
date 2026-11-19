import { CircleDot, Gauge, MapPin, MessageCircle, Search, Wrench } from "lucide-react";
import { Link } from "react-router-dom";
import { buildWhatsappUrl, GENERAL_WHATSAPP_URL } from "../../features/tires/tireWhatsapp";
import { TireImage } from "../../features/tires/TireImage";
import { TORQUE_MODELS } from "../../features/tires/torqueModels";
import { WhatsappButton } from "../../features/tires/WhatsappButton";
import {
  CallButton,
  Container,
  CtaBand,
  Eyebrow,
  LocationSection,
  SectionHeading,
  ShopSection,
  TextLink,
} from "../../site/components";
import { PAGES } from "../../site/seo";
import { ALIGNMENT_SERVICE, MECHANIC_SERVICES, TIRES_WHATSAPP_TEXT } from "../../site/services";
import { BUSINESS, SHOP_PHOTOS } from "../../site/siteConfig";
import { usePageSeo } from "../../site/usePageSeo";

const SERVICE_CARDS = [
  {
    to: "/alineacion-y-balanceo",
    icon: Gauge,
    title: "Alineación y balanceo",
    text: "Que tu auto vaya derecho, sin vibraciones y sin gastar llantas de más.",
    items: ALIGNMENT_SERVICE.items.map((item) => item.name),
  },
  {
    to: "/mecanica",
    icon: Wrench,
    title: "Mecánica",
    text: "Frenos, mantenimiento, suspensión y dirección.",
    items: MECHANIC_SERVICES.flatMap((group) => group.items.map((item) => item.name)),
  },
  {
    to: "/llantas",
    icon: CircleDot,
    title: "Venta de llantas",
    text: "Llantas Torque para auto, SUV, pickup y carga, con precio publicado.",
    items: ["Auto y deportivo", "SUV y pickup", "Todo terreno y lodo", "Camioneta de carga"],
  },
];

const STEPS = [
  { icon: MessageCircle, title: "Escríbenos", text: "Cuéntanos qué le pasa a tu auto o qué medida de llanta buscas." },
  { icon: Search, title: "Te cotizamos", text: "Te respondemos por WhatsApp con el precio antes de empezar." },
  { icon: MapPin, title: "Ven al taller", text: "Lunes a viernes de 10 am a 6 pm y sábado de 10 am a 2 pm, en la carretera federal México-Puebla km 82.5." },
];

export function HomePage() {
  usePageSeo(PAGES.home);

  return (
    <>
      <section className="relative overflow-hidden bg-gradient-to-br from-brand-ice/70 via-white to-brand-ice/40 text-brand-ink">
        <div aria-hidden="true" className="absolute inset-0 bg-[repeating-linear-gradient(115deg,transparent_0_46px,rgba(88,183,210,0.08)_46px_58px)]" />
        <div className="absolute inset-y-0 left-0 w-1.5 bg-brand-red" />
        <Container className="relative grid items-center gap-10 py-12 md:grid-cols-[1.25fr_1fr] md:py-20">
          <div>
            <Eyebrow>Taller automotriz en {BUSINESS.address.locality}</Eyebrow>
            <h1 className="mt-4 text-4xl font-black uppercase italic leading-[1.02] tracking-tight sm:text-5xl lg:text-6xl">
              Alineación, balanceo <span className="text-brand-red">y llantas</span> en San Matías Tlalancaleca
            </h1>
            <p className="mt-5 max-w-xl text-base text-slate-600 md:text-lg">
              Llantas Torque, alineación y balanceo, frenos, cambio de aceite, afinación, suspensión y dirección.
              Todo en un solo lugar, sobre la carretera federal México-Puebla.
            </p>
            <div className="mt-7 flex flex-col gap-3 sm:flex-row">
              <WhatsappButton href={GENERAL_WHATSAPP_URL} size="lg">
                Cotizar por WhatsApp
              </WhatsappButton>
              <CallButton />
            </div>
          </div>

          <figure className="relative mx-auto w-full max-w-xl">
            <div className="relative">
              <div aria-hidden="true" className="absolute inset-0 hidden translate-x-4 translate-y-4 rounded-xl bg-brand-sky/40 md:block" />
              <img
                alt={`Fachada de ${BUSINESS.name} sobre la carretera federal México-Puebla`}
                className="relative aspect-video w-full rounded-xl border-4 border-white object-cover shadow-2xl shadow-slate-400/50"
                fetchPriority="high"
                height={432}
                src={SHOP_PHOTOS.facade}
                width={768}
              />
            </div>
            <figcaption className="relative mt-4 flex items-center gap-2 text-sm font-semibold text-slate-600">
              <MapPin className="h-4 w-4 shrink-0 text-brand-red" />
              Carretera Federal México-Puebla km 82.5
            </figcaption>
          </figure>
        </Container>
      </section>

      <section className="py-14 md:py-20">
        <Container>
          <SectionHeading eyebrow="Servicios" title="Lo que hacemos por tu auto">
            Desde la llanta hasta la suspensión: revisamos, te explicamos y te cotizamos antes de trabajar.
          </SectionHeading>

          <div className="mt-8 grid gap-4 md:grid-cols-3">
            {SERVICE_CARDS.map(({ icon: Icon, ...card }) => (
              <Link
                className="group flex flex-col rounded-lg border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-0.5 hover:border-brand-red/40 hover:shadow-md focus:outline-none focus-visible:ring-4 focus-visible:ring-brand-sky-dark/20"
                key={card.to}
                to={card.to}
              >
                <span className="flex h-12 w-12 items-center justify-center rounded-md bg-brand-red text-white">
                  <Icon className="h-6 w-6" />
                </span>
                <h3 className="mt-4 text-xl font-black uppercase italic text-brand-ink">{card.title}</h3>
                <p className="mt-1 text-sm text-slate-600">{card.text}</p>
                <ul className="mt-4 flex flex-wrap gap-1.5">
                  {card.items.map((item) => (
                    <li className="rounded bg-slate-100 px-2 py-1 text-xs font-semibold text-slate-700" key={item}>
                      {item}
                    </li>
                  ))}
                </ul>
                <span className="mt-auto inline-flex items-center gap-1 pt-5 text-sm font-bold text-brand-sky-dark group-hover:underline">
                  Ver más →
                </span>
              </Link>
            ))}
          </div>
        </Container>
      </section>

      <section className="bg-brand-ice/40 py-14 md:py-20">
        <Container>
          <div className="flex flex-wrap items-end justify-between gap-4">
            <SectionHeading eyebrow="Llantas Torque" title="Encuentra la llanta para tu camino">
              Revisa medidas y precios en línea y pide tu cotización con instalación, alineación y balanceo.
            </SectionHeading>
            <TextLink to="/llantas">Ver catálogo completo</TextLink>
          </div>

          <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-4">
            {TORQUE_MODELS.slice(0, 4).map((model) => (
              <Link
                className="flex flex-col items-center rounded-lg border border-slate-200 bg-white p-3 text-center shadow-sm transition hover:border-brand-sky-dark/40"
                key={model.code}
                to="/llantas"
              >
                <TireImage className="w-full max-w-36" model={model.code} size={144} />
                <span className="mt-1 font-black text-brand-ink">{model.name}</span>
                <span className="text-xs text-slate-500">{model.category}</span>
              </Link>
            ))}
          </div>
          <div className="mt-6">
            <WhatsappButton href={buildWhatsappUrl(TIRES_WHATSAPP_TEXT)} variant="outline">
              Cotizar llantas por WhatsApp
            </WhatsappButton>
          </div>
        </Container>
      </section>

      <ShopSection />

      <section className="py-14 md:py-20">
        <Container>
          <SectionHeading eyebrow="Así de fácil" title="Cotiza sin vueltas" />
          <ol className="mt-8 grid gap-4 md:grid-cols-3">
            {STEPS.map(({ icon: Icon, title, text }, index) => (
              <li className="relative rounded-lg border border-slate-200 bg-white p-6 shadow-sm" key={title}>
                <span className="absolute right-5 top-4 text-5xl font-black italic text-slate-100">{index + 1}</span>
                <Icon className="relative h-7 w-7 text-brand-red" />
                <h3 className="relative mt-3 text-lg font-black uppercase italic text-brand-ink">{title}</h3>
                <p className="relative mt-1 text-sm text-slate-600">{text}</p>
              </li>
            ))}
          </ol>
        </Container>
      </section>

      <LocationSection />

      <CtaBand
        text="Escríbenos y te respondemos con tu cotización."
        title="¿Tu auto necesita servicio?"
        whatsappText="Hola, quiero cotizar un servicio para mi auto."
      />
    </>
  );
}
