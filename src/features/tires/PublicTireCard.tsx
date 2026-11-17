import { Link } from "react-router-dom";
import type { PublicTire } from "../../types/publicTires";
import { formatTireMoney } from "./tireCatalogUtils";
import { TireImage } from "./TireImage";
import { buildTireWhatsappUrl } from "./tireWhatsapp";
import { WhatsappButton } from "./WhatsappButton";

type PublicTireCardProps = {
  tire: PublicTire;
};

export function PublicTireCard({ tire }: PublicTireCardProps) {
  return (
    <article className="flex flex-col overflow-hidden rounded-md border border-slate-200 bg-white shadow-sm transition hover:border-[#1D4ED8]/40 hover:shadow-md">
      <Link
        className="flex flex-1 flex-col p-3 focus:outline-none focus-visible:ring-4 focus-visible:ring-[#1D4ED8]/20 md:p-4"
        to={`/catalog/${tire.id}`}
      >
        <div className="relative rounded-md bg-slate-100 p-2">
          <TireImage className="mx-auto w-full max-w-44" model={tire.model} seed={tire.id} />
          {tire.model ? (
            <span className="absolute left-1.5 top-1.5 rounded bg-[#1D4ED8] px-1.5 py-0.5 text-[10px] font-bold text-white md:text-xs">
              {tire.model}
            </span>
          ) : null}
          <span className="absolute bottom-1 right-1.5 text-[9px] text-slate-400">Imagen de referencia</span>
        </div>

        <p className="mt-2 text-xs font-semibold text-slate-500">Rin {tire.rim}</p>
        <p className="text-base font-black text-slate-950 md:text-lg">{tire.size}</p>
        <p className="mt-0.5 line-clamp-2 text-xs text-slate-500 md:text-sm">{tire.description}</p>

        <p className="mt-auto pt-2 text-lg font-black text-[#B3262D] md:text-xl">
          {formatTireMoney(tire.suggestedPrice)}
        </p>
      </Link>

      <div className="px-3 pb-3 md:px-4 md:pb-4">
        <WhatsappButton className="w-full" href={buildTireWhatsappUrl(tire)} size="sm">
          Cotizar
        </WhatsappButton>
      </div>
    </article>
  );
}
