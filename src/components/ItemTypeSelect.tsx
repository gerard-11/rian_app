import { ChevronDown } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { ITEM_TYPES, type ItemType } from "../types/workOrders";
import { itemTypeLabels } from "../utils/quickWorkOrderForm";

type ItemTypeSelectProps = {
  id?: string;
  onChange: (value: ItemType) => void;
  value: ItemType;
};

export function ItemTypeSelect({ id, onChange, value }: ItemTypeSelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isOpen) return;

    const handleOutsidePointer = (event: PointerEvent) => {
      if (!containerRef.current?.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("pointerdown", handleOutsidePointer);
    return () => document.removeEventListener("pointerdown", handleOutsidePointer);
  }, [isOpen]);

  return (
    <div className="relative min-w-0" ref={containerRef}>
      <button
        aria-expanded={isOpen}
        aria-haspopup="listbox"
        className="mt-2 flex h-12 w-full min-w-0 items-center justify-between gap-2 rounded-md border border-slate-300 bg-white px-3 text-left text-base outline-none transition focus:border-[#B3262D] focus:ring-4 focus:ring-[#B3262D]/15"
        id={id}
        onClick={() => setIsOpen((current) => !current)}
        type="button"
      >
        <span className="min-w-0 truncate">{itemTypeLabels[value]}</span>
        <ChevronDown className="h-4 w-4 shrink-0 text-slate-400" />
      </button>

      {isOpen ? (
        <div
          aria-label="Tipos de item"
          className="absolute left-0 right-0 top-full z-50 mt-1 max-h-60 overflow-y-auto rounded-md border border-slate-300 bg-white p-1 shadow-xl"
          role="listbox"
        >
          {ITEM_TYPES.map((type) => (
            <button
              aria-selected={value === type}
              className={`block w-full rounded px-3 py-2 text-left text-sm transition ${value === type ? "bg-[#B3262D]/10 font-semibold text-[#B3262D]" : "text-slate-700 hover:bg-slate-100"}`}
              key={type}
              onClick={() => {
                onChange(type);
                setIsOpen(false);
              }}
              role="option"
              type="button"
            >
              {itemTypeLabels[type]}
            </button>
          ))}
        </div>
      ) : null}
    </div>
  );
}
