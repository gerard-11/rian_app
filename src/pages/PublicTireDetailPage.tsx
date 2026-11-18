import { AlertCircle, ArrowLeft, LoaderCircle } from "lucide-react";
import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import { formatTireMoney } from "../features/tires/tireCatalogUtils";
import { getTireImages, TIRE_IMAGE_DISCLAIMER } from "../features/tires/tireImages";
import { TireImage } from "../features/tires/TireImage";
import { buildTireWhatsappUrl, WHATSAPP_INTENTS } from "../features/tires/tireWhatsapp";
import { WhatsappButton } from "../features/tires/WhatsappButton";
import { usePublicTire } from "../hooks/usePublicTires";

const QUANTITIES = [1, 2, 4];

const backLink = (
  <Link
    className="mb-4 inline-flex h-10 items-center gap-2 rounded-md px-2 text-sm font-semibold text-[#1D4ED8] transition hover:bg-[#1D4ED8]/10"
    to="/"
  >
    <ArrowLeft className="h-4 w-4" />
    Volver al catálogo
  </Link>
);

export function PublicTireDetailPage() {
  const { id } = useParams();
  const { data: tire, isError, isPending } = usePublicTire(id);
  const [imageIndex, setImageIndex] = useState(0);
  const [quantity, setQuantity] = useState(4);

  if (isPending) {
    return (
      <div className="flex min-h-64 items-center justify-center rounded-md border border-slate-200 bg-white text-sm font-semibold text-slate-600 shadow-sm">
        <LoaderCircle className="mr-2 h-5 w-5 animate-spin text-[#B3262D]" />
        Cargando llanta...
      </div>
    );
  }

  if (isError || !tire) {
    return (
      <>
        {backLink}
        <div className="flex items-start gap-3 rounded-md border border-[#d71920]/30 bg-[#d71920]/10 px-4 py-3 text-sm font-medium text-[#a41218]">
          <AlertCircle className="mt-0.5 h-5 w-5 shrink-0" />
          Esta llanta no existe o ya no está disponible.
        </div>
      </>
    );
  }

  const images = getTireImages(tire.model);
  const currentImage = images[imageIndex] ?? images[0];
  const specs = [
    { label: "Medida", value: tire.size },
    { label: "Rin", value: tire.rim },
    { label: "Modelo", value: tire.model ?? "—" },
    { label: "SKU", value: tire.sku },
  ];

  return (
    <>
      {backLink}
      <section className="grid gap-6 overflow-hidden rounded-lg border border-slate-200 bg-white p-4 shadow-sm md:grid-cols-2 md:p-8">
        <figure>
          <div className="rounded-md bg-slate-100 p-4 md:p-6">
            <TireImage
              className="mx-auto w-full max-w-sm"
              key={currentImage}
              loading="eager"
              model={tire.model}
              size={400}
              src={currentImage}
            />
          </div>
          {images.length > 1 ? (
            <div className="mt-3 flex gap-2 overflow-x-auto">
              {images.map((image, index) => (
                <button
                  aria-label={`Ver imagen ${index + 1}`}
                  className={`shrink-0 rounded-md border-2 bg-slate-100 p-1 ${
                    index === imageIndex ? "border-[#1D4ED8]" : "border-transparent"
                  }`}
                  key={image}
                  onClick={() => setImageIndex(index)}
                  type="button"
                >
                  <TireImage className="w-16" model={tire.model} size={64} src={image} />
                </button>
              ))}
            </div>
          ) : null}
          <figcaption className="mt-2 text-xs text-slate-500">{TIRE_IMAGE_DISCLAIMER}</figcaption>
        </figure>

        <div>
          <span className="inline-block rounded bg-[#1D4ED8] px-2 py-1 text-xs font-bold uppercase tracking-wider text-white">
            Torque {tire.model}
          </span>
          <h1 className="mt-2 text-3xl font-black text-slate-950 md:text-4xl">{tire.size}</h1>
          <p className="mt-2 text-sm text-slate-500">{tire.description}</p>

          <p className="mt-5 text-4xl font-black text-[#B3262D]">
            {formatTireMoney(tire.suggestedPrice)}
          </p>
          <p className="mt-1 text-xs text-slate-500">Precio por llanta, sugerido al público con IVA incluido.</p>

          <dl className="mt-5 grid grid-cols-2 gap-2">
            {specs.map((spec) => (
              <div className="rounded-md border border-slate-200 px-3 py-2" key={spec.label}>
                <dt className="text-xs font-semibold text-slate-500">{spec.label}</dt>
                <dd className="mt-0.5 text-sm font-bold text-slate-950">{spec.value}</dd>
              </div>
            ))}
          </dl>

          <div className="mt-6 rounded-md border-2 border-[#1FAF54]/30 bg-[#1FAF54]/5 p-4">
            <p className="text-sm font-bold text-slate-950">Cotiza por WhatsApp</p>
            <div className="mt-3 flex items-center gap-2">
              <span className="text-sm text-slate-600">Piezas:</span>
              {QUANTITIES.map((value) => (
                <button
                  aria-pressed={quantity === value}
                  className={`h-9 w-11 rounded-md border text-sm font-bold transition ${
                    quantity === value
                      ? "border-[#1D4ED8] bg-[#1D4ED8] text-white"
                      : "border-slate-300 bg-white text-slate-700 hover:bg-slate-100"
                  }`}
                  key={value}
                  onClick={() => setQuantity(value)}
                  type="button"
                >
                  {value}
                </button>
              ))}
            </div>
            <div className="mt-3 grid gap-2">
              {WHATSAPP_INTENTS.map(({ intent, label }, index) => (
                <WhatsappButton
                  href={buildTireWhatsappUrl(tire, intent, quantity)}
                  key={intent}
                  size={index === 0 ? "lg" : "md"}
                  variant={index === 0 ? "solid" : "outline"}
                >
                  {label}
                </WhatsappButton>
              ))}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
