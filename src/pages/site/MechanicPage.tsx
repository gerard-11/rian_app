import { Disc3, Droplets, Wrench } from "lucide-react";
import { Container, CtaBand, LocationSection, PageHero, ServiceGroupBlock } from "../../site/components";
import { PAGES } from "../../site/seo";
import { MECHANIC_SERVICES } from "../../site/services";
import { usePageSeo } from "../../site/usePageSeo";

const GROUP_ICONS = { frenos: Disc3, mantenimiento: Droplets, "suspension-y-direccion": Wrench } as const;

export function MechanicPage() {
  usePageSeo(PAGES.mechanic);

  return (
    <>
      <PageHero
        aside={
          <nav aria-label="Servicios de mecánica" className="grid gap-2">
            {MECHANIC_SERVICES.map((group) => {
              const Icon = GROUP_ICONS[group.id as keyof typeof GROUP_ICONS] ?? Wrench;
              return (
                <a
                  className="flex items-center gap-3 rounded-md border border-slate-200 bg-white px-4 py-3 font-bold shadow-sm transition hover:border-brand-sky"
                  href={`#${group.id}`}
                  key={group.id}
                >
                  <Icon className="h-5 w-5 text-brand-red" />
                  {group.title}
                </a>
              );
            })}
          </nav>
        }
        description="Frenos, cambio de aceite, afinación, suspensión y dirección. Revisamos tu auto, te explicamos lo que necesita y te cotizamos antes de trabajar."
        eyebrow="Mecánica automotriz"
        title="Taller mecánico en San Matías Tlalancaleca"
        whatsappText="Hola, quiero cotizar un servicio de mecánica para mi auto."
      />

      <section className="py-14 md:py-20">
        <Container className="grid gap-6">
          {MECHANIC_SERVICES.map((group) => (
            <ServiceGroupBlock group={group} key={group.id} />
          ))}
        </Container>
      </section>

      <LocationSection />

      <CtaBand
        text="Cuéntanos qué le pasa a tu auto y te cotizamos."
        title="¿Ruidos, golpeteos o ya toca servicio?"
        whatsappText="Hola, quiero cotizar un servicio de mecánica para mi auto."
      />
    </>
  );
}
