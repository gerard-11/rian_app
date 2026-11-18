import { Search, X } from "lucide-react";
import { TIRE_IMAGE_DISCLAIMER } from "./tireImages";
import { TireImage } from "./TireImage";
import { TORQUE_MODELS } from "./torqueModels";

type PublicCatalogHeroProps = {
  search: string;
  selectedModel: string | null;
  total: number;
  onSearchChange: (value: string) => void;
  onModelChange: (model: string | null) => void;
};

export function PublicCatalogHero({
  search,
  selectedModel,
  total,
  onSearchChange,
  onModelChange,
}: PublicCatalogHeroProps) {
  return (
    <section className="mb-6">
      <div className="relative overflow-hidden rounded-lg border border-slate-200 bg-white px-5 py-7 text-slate-950 shadow-sm md:px-10 md:py-12">
        <div className="absolute inset-y-0 right-0 hidden w-2 bg-[#B3262D] md:block" />
        <p className="inline-block rounded bg-[#B3262D] px-2 py-1 text-xs font-bold uppercase tracking-wider text-white">
          Catálogo de llantas
        </p>
        <h1 className="mt-3 text-3xl font-black uppercase leading-tight md:text-5xl">
          Llantas Torque
        </h1>
        <p className="mt-2 max-w-xl text-sm text-slate-600 md:text-base">
          Encuentra tu medida, revisa el precio y cotiza directo por WhatsApp.
        </p>

        <div className="mt-5 flex h-12 w-full max-w-xl items-center rounded-md border border-slate-300 bg-white px-3 text-slate-950 shadow-sm focus-within:border-[#1D4ED8] focus-within:ring-4 focus-within:ring-[#1D4ED8]/20">
          <Search className="h-5 w-5 shrink-0 text-slate-400" />
          <input
            aria-label="Buscar llanta"
            className="h-full min-w-0 flex-1 bg-transparent px-3 text-base outline-none placeholder:text-slate-400"
            onChange={(event) => onSearchChange(event.target.value)}
            placeholder="Ej. 205/55 R16"
            type="search"
            value={search}
          />
        </div>
        <p className="mt-3 text-sm font-semibold text-slate-600">
          {total} llantas {search.trim() || selectedModel ? "encontradas" : "disponibles"}
        </p>
      </div>

      <div className="mt-6 flex items-end justify-between gap-3">
        <h2 className="text-lg font-black uppercase text-slate-950 md:text-xl">
          <span className="text-[#B3262D]">Modelos</span> Torque
        </h2>
        {selectedModel ? (
          <button
            className="flex h-9 items-center gap-1 rounded-md px-2 text-sm font-semibold text-[#1D4ED8] hover:bg-[#1D4ED8]/10"
            onClick={() => onModelChange(null)}
            type="button"
          >
            <X className="h-4 w-4" />
            Ver todos
          </button>
        ) : null}
      </div>

      <div className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-4">
        {TORQUE_MODELS.map((model) => {
          const isSelected = selectedModel === model.code;
          return (
            <button
              aria-pressed={isSelected}
              className={`flex flex-col items-center rounded-md border-2 bg-white p-2 text-center shadow-sm transition hover:border-[#1D4ED8]/50 md:p-3 ${
                isSelected ? "border-[#B3262D] ring-4 ring-[#B3262D]/15" : "border-transparent"
              }`}
              key={model.code}
              onClick={() => onModelChange(isSelected ? null : model.code)}
              type="button"
            >
              <TireImage className="w-full max-w-28 md:max-w-36" loading="eager" model={model.code} size={144} />
              <span className="mt-1 text-sm font-black text-[#1D4ED8] md:text-base">{model.name}</span>
              <span className="text-xs text-slate-500">{model.category}</span>
            </button>
          );
        })}
      </div>
      <p className="mt-2 text-xs text-slate-500">{TIRE_IMAGE_DISCLAIMER}</p>
    </section>
  );
}
