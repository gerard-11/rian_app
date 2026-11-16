import type { TireCatalogItem } from "../../types/tireCatalog";
import { formatTireMoney } from "./tireCatalogUtils";

type TireCatalogTableProps = {
  tires: TireCatalogItem[];
  showCost: boolean;
};

const withCost = "lg:grid-cols-[120px_130px_minmax(0,1fr)_140px_140px]";
const withoutCost = "lg:grid-cols-[120px_130px_minmax(0,1fr)_140px]";

export function TireCatalogTable({ tires, showCost }: TireCatalogTableProps) {
  const columns = showCost ? withCost : withoutCost;

  return (
    <div className="overflow-hidden rounded-md border border-slate-200 bg-white shadow-sm">
      <div className={`hidden ${columns} gap-4 border-b border-slate-200 bg-slate-100 px-4 py-3 text-xs font-bold uppercase text-slate-500 lg:grid`}>
        <span>Medida</span>
        <span>SKU</span>
        <span>Nombre</span>
        {showCost ? <span>Costo</span> : null}
        <span>Precio sugerido</span>
      </div>
      <div className="divide-y divide-slate-200">
        {tires.map((tire) => (
          <article
            className={`grid gap-3 px-4 py-4 ${columns} lg:items-center`}
            key={tire.id}
          >
            <div>
              <p className="text-base font-bold text-[#B3262D]">{tire.size}</p>
              <p className="mt-1 text-xs font-medium text-slate-500">
                Rin {tire.rim}
              </p>
            </div>
            <div>
              <p className="text-xs font-semibold uppercase text-slate-500 lg:hidden">
                SKU
              </p>
              <p className="mt-1 text-sm font-semibold text-slate-800 lg:mt-0">
                {tire.sku}
              </p>
            </div>
            <p className="text-sm font-semibold text-slate-950">
              {tire.description}
            </p>
            {showCost && tire.costAmount !== undefined ? (
            <div>
              <p className="text-xs font-semibold uppercase text-slate-500 lg:hidden">
                Costo
              </p>
              <p className="mt-1 text-sm font-semibold text-[#a41218] lg:mt-0">
                {formatTireMoney(tire.costAmount)}
              </p>
            </div>
            ) : null}
            <div>
              <p className="text-xs font-semibold uppercase text-slate-500 lg:hidden">
                Precio sugerido
              </p>
              <p className="mt-1 text-base font-bold text-emerald-700 lg:mt-0">
                {formatTireMoney(tire.suggestedPrice)}
              </p>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
