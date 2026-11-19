import { Gauge } from "lucide-react";
import { Container, CtaBand, LocationSection, PageHero, SectionHeading, SignsList, TextLink } from "../../site/components";
import { PAGES } from "../../site/seo";
import { ALIGNMENT_SERVICE } from "../../site/services";
import { usePageSeo } from "../../site/usePageSeo";

export function AlignmentPage() {
  usePageSeo(PAGES.alignment);

  return (
    <>
      <PageHero
        aside={
          <div className="hidden justify-center md:flex">
            <span className="flex h-44 w-44 items-center justify-center rounded-full border-8 border-white bg-brand-red text-white shadow-2xl shadow-brand-red/30">
              <Gauge className="h-20 w-20" />
            </span>
          </div>
        }
        description={ALIGNMENT_SERVICE.summary}
        eyebrow="Servicio"
        title="Alineación y balanceo en San Matías Tlalancaleca"
        whatsappText={ALIGNMENT_SERVICE.whatsappText}
      />

      <section className="py-14 md:py-20">
        <Container className="grid gap-10 md:grid-cols-2">
          {ALIGNMENT_SERVICE.items.map((item) => (
            <article key={item.id}>
              <h2 className="text-2xl font-black uppercase italic text-brand-ink md:text-3xl">{item.name}</h2>
              <div className="mt-2 h-1 w-12 bg-brand-red" />
              <p className="mt-4 text-slate-600">{item.description}</p>
            </article>
          ))}
        </Container>
      </section>

      <section className="bg-brand-ice/40 py-14 md:py-20">
        <Container className="grid gap-10 md:grid-cols-2">
          <SectionHeading eyebrow="Señales" title="¿Cuándo necesitas alineación y balanceo?">
            Una alineación a tiempo cuida tus llantas, tu suspensión y tu gasolina. Revísala si notas alguno de estos
            síntomas:
          </SectionHeading>
          <div className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
            <SignsList signs={ALIGNMENT_SERVICE.signs} />
          </div>
        </Container>
      </section>

      <section className="py-14 md:py-16">
        <Container className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="max-w-xl">
            <h2 className="text-2xl font-black uppercase italic text-brand-ink">¿Vas a cambiar llantas?</h2>
            <p className="mt-2 text-slate-600">
              Revisa nuestro catálogo de llantas Torque y cotiza con instalación, alineación y balanceo incluidos.
            </p>
          </div>
          <TextLink to="/llantas">Ver llantas</TextLink>
        </Container>
      </section>

      <LocationSection />

      <CtaBand
        text="Pregunta por disponibilidad y precio por WhatsApp."
        title="Agenda tu alineación"
        whatsappText={ALIGNMENT_SERVICE.whatsappText}
      />
    </>
  );
}
