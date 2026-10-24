import { Check, Plus, Search, Wrench, X } from "lucide-react";
import { useMemo, useState } from "react";
import {
  calculateFinalPrice,
  formatPartDescription,
  isValidAmount,
  readCustomParts,
  saveCustomPart,
  SUGGESTED_PARTS,
  type PartSelection,
} from "../utils/partsSelector";

type PartSelectorProps = {
  idPrefix?: string;
  onAdd: (selection: PartSelection & { finalPrice: number }) => void;
};

const inputClass =
  "mt-2 h-11 w-full rounded-md border border-slate-300 bg-white px-3 text-sm outline-none transition focus:border-[#4169e1] focus:ring-4 focus:ring-[#4169e1]/15";

export function PartSelector({ idPrefix = "part", onAdd }: PartSelectorProps) {
  const [customParts, setCustomParts] = useState(readCustomParts);
  const [search, setSearch] = useState("");
  const [customPart, setCustomPart] = useState("");
  const [selectedDescription, setSelectedDescription] = useState("");
  const [quantity, setQuantity] = useState("1");
  const [costBase, setCostBase] = useState("");
  const [margin, setMargin] = useState("100");
  const [submitted, setSubmitted] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const availableParts = useMemo(
    () => [...SUGGESTED_PARTS, ...customParts],
    [customParts],
  );
  const filteredParts = availableParts.filter((part) =>
    part.toLocaleLowerCase().includes(search.trim().toLocaleLowerCase()),
  );
  const costIsValid = isValidAmount(costBase) && Number(costBase) > 0;
  const marginIsValid = isValidAmount(margin);
  const quantityIsValid = Number.isInteger(Number(quantity)) && Number(quantity) > 0;
  const units = Number(quantity);
  const totalCost = costIsValid ? Number(costBase) * units : 0;
  const totalMargin = marginIsValid ? Number(margin) * units : 0;
  const finalPrice = costIsValid && marginIsValid
    ? calculateFinalPrice(totalCost, totalMargin)
    : 0;
  const hasSelection = selectedDescription.trim().length >= 2;
  const canAdd = hasSelection && costIsValid && marginIsValid && quantityIsValid;

  const selectPart = (description: string) => {
    setSelectedDescription(description);
    setSearch(description);
    setSubmitted(false);
    setIsMenuOpen(false);
  };

  const addCustomPart = () => {
    const cleanPart = customPart.trim();
    if (cleanPart.length < 2) return;

    saveCustomPart(cleanPart);
    setCustomParts(readCustomParts());
    setCustomPart("");
    selectPart(cleanPart);
  };

  const addToDetail = () => {
    if (!canAdd) return;

    onAdd({
      description: formatPartDescription(
        selectedDescription,
        Number(quantity),
        "piece",
      ),
      quantity: Number(quantity),
      presentation: "piece",
      costBase: totalCost,
      margin: totalMargin,
      finalPrice,
    });
    setSubmitted(true);
    setIsModalOpen(false);
  };

  return (
    <>
      <button
        className="mb-3 flex min-h-11 w-full items-center justify-between gap-3 rounded-md border border-[#4169e1]/40 bg-[#4169e1]/5 px-3 py-2 text-left transition hover:border-[#4169e1] hover:bg-[#4169e1]/10"
        onClick={() => setIsModalOpen(true)}
        type="button"
      >
        <span className="flex min-w-0 items-center gap-2">
          <Wrench className="h-4 w-4 shrink-0 text-[#4169e1]" />
          <span className="truncate text-sm font-semibold text-slate-800">
            {hasSelection ? selectedDescription : "Seleccionar refacción"}
          </span>
        </span>
        <span className="shrink-0 text-xs font-bold text-[#4169e1]">
          {hasSelection ? "Editar" : "Abrir selector"}
        </span>
      </button>

      {isModalOpen ? (
        <div
          aria-label="Selector de refacciones"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/55 p-4"
          role="dialog"
        >
          <div className="h-[80vh] max-h-[80vh] min-h-0 w-full max-w-4xl overflow-y-auto rounded-lg border border-slate-200 bg-white p-5 shadow-2xl sm:p-6">
            <div className="flex items-start justify-between gap-4 border-b border-slate-200 pb-4">
              <div>
                <div className="flex items-center gap-2 text-lg font-bold text-slate-950">
                  <Wrench className="h-5 w-5 text-[#4169e1]" />
                  Agregar refacción
                </div>
                <p className="mt-1 text-sm text-slate-500">
                  Busca, configura el precio y revisa el resumen antes de agregarla al detalle.
                </p>
              </div>
              <button
                aria-label="Cerrar selector de refacciones"
                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md text-slate-500 transition hover:bg-slate-100 hover:text-slate-900"
                onClick={() => setIsModalOpen(false)}
                type="button"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="mt-4 grid gap-3 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
        <div>
          <label className="text-xs font-semibold text-slate-700" htmlFor={`${idPrefix}-search`}>
            Buscar refacción
          </label>
          <div className="relative">
            <Search className="pointer-events-none absolute left-3 top-5 h-4 w-4 text-slate-400" />
            <input
              className={`${inputClass} pl-9`}
              id={`${idPrefix}-search`}
              onFocus={() => setIsMenuOpen(true)}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Ej. rótula"
              value={search}
            />
            {isMenuOpen ? (
              <div className="absolute z-20 mt-1 max-h-56 w-full overflow-y-auto rounded-md border border-slate-300 bg-white p-1 shadow-lg" role="listbox" aria-label="Sugerencias de refacciones">
                {filteredParts.length ? filteredParts.map((part) => (
                  <button
                    className="block w-full rounded px-3 py-2 text-left text-sm text-slate-700 hover:bg-[#4169e1]/10 hover:text-[#4169e1]"
                    key={part}
                    onClick={() => selectPart(part)}
                    type="button"
                  >
                    {part}
                  </button>
                )) : <p className="px-3 py-2 text-sm text-slate-500">No hay coincidencias.</p>}
              </div>
            ) : null}
          </div>
        </div>

        <div>
          <label className="text-xs font-semibold text-slate-700" htmlFor={`${idPrefix}-custom`}>
            Refacción personalizada
          </label>
          <div className="mt-2 flex gap-2">
            <input
              className="h-11 min-w-0 flex-1 rounded-md border border-slate-300 bg-white px-3 text-sm outline-none focus:border-[#4169e1] focus:ring-4 focus:ring-[#4169e1]/15"
              id={`${idPrefix}-custom`}
              onChange={(event) => setCustomPart(event.target.value)}
              onKeyDown={(event) => { if (event.key === "Enter") { event.preventDefault(); addCustomPart(); } }}
              placeholder="Ej. Kit de clutch"
              value={customPart}
            />
            <button
              aria-label="Guardar refacción personalizada"
              className="flex h-11 w-11 shrink-0 items-center justify-center rounded-md bg-[#4169e1] text-white transition hover:bg-[#3658c9] disabled:bg-slate-300"
              disabled={customPart.trim().length < 2}
              onClick={addCustomPart}
              type="button"
            >
              <Plus className="h-4 w-4" />
            </button>
          </div>
          <p className="mt-2 text-xs text-slate-500">Se guardará en este navegador para futuras capturas.</p>
        </div>
      </div>

      {hasSelection ? (
        <div className="mt-4 border-t border-[#4169e1]/15 pt-4">
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
            <div className="lg:col-span-2">
              <label className="text-xs font-semibold text-slate-700" htmlFor={`${idPrefix}-description`}>Descripción</label>
              <input className={inputClass} id={`${idPrefix}-description`} onChange={(event) => setSelectedDescription(event.target.value)} value={selectedDescription} />
            </div>
            <div>
              <label className="text-xs font-semibold text-slate-700" htmlFor={`${idPrefix}-quantity`}>Cantidad</label>
              <input aria-invalid={!quantityIsValid} className={inputClass} id={`${idPrefix}-quantity`} inputMode="numeric" min="1" onChange={(event) => setQuantity(event.target.value)} type="number" value={quantity} />
            </div>
            <div>
              <label className="text-xs font-semibold text-slate-700" htmlFor={`${idPrefix}-cost`}>Costo base por pieza</label>
              <input aria-invalid={!costIsValid} className={inputClass} id={`${idPrefix}-cost`} inputMode="decimal" min="0" onChange={(event) => setCostBase(event.target.value)} placeholder="0.00" type="number" value={costBase} />
            </div>
            <div>
              <label className="text-xs font-semibold text-slate-700" htmlFor={`${idPrefix}-margin`}>Margen por pieza</label>
              <input aria-invalid={!marginIsValid} className={inputClass} id={`${idPrefix}-margin`} inputMode="decimal" min="0" onChange={(event) => setMargin(event.target.value)} type="number" value={margin} />
            </div>
            <div className="rounded-md border border-emerald-200 bg-emerald-50 px-3 py-2 sm:col-span-2 lg:col-span-3">
              <span className="text-xs font-semibold text-emerald-800">Precio final</span>
              <p className="mt-1 text-lg font-bold text-emerald-900">${finalPrice.toFixed(2)}</p>
            </div>
          </div>

          <div className="mt-4 rounded-md border border-slate-200 bg-white p-3">
            <p className="text-xs font-bold uppercase tracking-wide text-slate-500">Resumen antes de agregar</p>
            <dl className="mt-2 grid gap-2 text-sm sm:grid-cols-2 lg:grid-cols-5">
              <div><dt className="text-slate-500">Descripción</dt><dd className="font-semibold text-slate-900">{formatPartDescription(selectedDescription, Number(quantity) || 0, "piece")}</dd></div>
              <div><dt className="text-slate-500">Cantidad</dt><dd className="font-semibold text-slate-900">{quantity}</dd></div>
              <div><dt className="text-slate-500">Costo base total</dt><dd className="font-semibold text-slate-900">${costIsValid ? totalCost.toFixed(2) : "—"}</dd></div>
              <div><dt className="text-slate-500">Margen total</dt><dd className="font-semibold text-slate-900">${marginIsValid ? totalMargin.toFixed(2) : "—"}</dd></div>
              <div><dt className="text-slate-500">Precio final</dt><dd className="font-semibold text-emerald-700">${finalPrice.toFixed(2)}</dd></div>
            </dl>
            {!costIsValid || !marginIsValid || !quantityIsValid ? <p className="mt-2 text-xs font-medium text-[#d71920]">Ingresa costo base, margen y cantidad válidos para agregar.</p> : null}
            <button className="mt-3 inline-flex h-10 items-center gap-2 rounded-md bg-[#4169e1] px-4 text-sm font-semibold text-white transition hover:bg-[#3658c9] disabled:cursor-not-allowed disabled:bg-slate-300" disabled={!canAdd} onClick={addToDetail} type="button">
              <Check className="h-4 w-4" />
              {submitted ? "Refacción agregada al detalle" : "Agregar refacción al detalle"}
            </button>
          </div>
        </div>
      ) : null}
          </div>
        </div>
      ) : null}
    </>
  );
}
