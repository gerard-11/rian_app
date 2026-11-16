import { ChevronDown } from "lucide-react";
import { useCallback, useEffect, useRef, useState, type ReactNode } from "react";
import { createPortal } from "react-dom";
import { Link } from "react-router-dom";

// Menu desplegable de acciones para filas de ordenes y presupuestos.
// Quien lo usa decide que acciones incluir segun tipo, estado y rol.
export type ActionMenuItem = {
  key: string;
  label: string;
  icon: ReactNode;
  to?: string;
  onClick?: () => void;
  tone?: "default" | "success" | "danger";
  disabled?: boolean;
};

type ActionsMenuProps = {
  actions: ActionMenuItem[];
  disabled?: boolean;
};

const toneClass = {
  default: "text-slate-700 hover:bg-slate-100",
  success: "text-emerald-700 hover:bg-emerald-50",
  danger: "text-[#a41218] hover:bg-[#d71920]/10",
} as const;

const itemClass = "flex w-full items-center gap-2 rounded px-3 py-2 text-left text-sm font-semibold transition focus:outline-none focus:ring-2 focus:ring-[#B3262D]/30 disabled:cursor-not-allowed disabled:text-slate-300 disabled:hover:bg-transparent";
const MENU_WIDTH = 192;

export function ActionsMenu({ actions, disabled = false }: ActionsMenuProps) {
  const [position, setPosition] = useState<{ top: number; left: number }>();
  const buttonRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const isOpen = position !== undefined;

  const close = useCallback(() => setPosition(undefined), []);

  useEffect(() => {
    if (!isOpen) return;

    const onPointerDown = (event: MouseEvent) => {
      const target = event.target as Node;

      if (!menuRef.current?.contains(target) && !buttonRef.current?.contains(target)) close();
    };
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") close();
    };

    document.addEventListener("mousedown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    window.addEventListener("scroll", close, true);
    window.addEventListener("resize", close);

    return () => {
      document.removeEventListener("mousedown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("scroll", close, true);
      window.removeEventListener("resize", close);
    };
  }, [close, isOpen]);

  if (!actions.length) return null;

  const toggle = () => {
    if (isOpen) return close();

    const rect = buttonRef.current?.getBoundingClientRect();

    if (!rect) return;

    // El menu se renderiza en un portal para que no lo recorte el overflow de la tabla.
    const menuHeight = actions.length * 40 + 8;
    const opensUp = rect.bottom + menuHeight > window.innerHeight && rect.top > menuHeight;

    setPosition({
      top: opensUp ? rect.top - menuHeight - 4 : rect.bottom + 4,
      left: Math.max(8, Math.min(rect.right - MENU_WIDTH, window.innerWidth - MENU_WIDTH - 8)),
    });
  };

  return (
    <>
      <button
        aria-expanded={isOpen}
        aria-haspopup="menu"
        className="flex h-9 items-center gap-1.5 rounded-md border border-slate-300 bg-white px-3 text-xs font-bold text-slate-700 transition hover:bg-slate-100 focus:outline-none focus:ring-4 focus:ring-[#B3262D]/15 disabled:cursor-not-allowed disabled:text-slate-300"
        disabled={disabled}
        onClick={toggle}
        ref={buttonRef}
        type="button"
      >
        Acciones
        <ChevronDown className={`h-4 w-4 transition ${isOpen ? "rotate-180" : ""}`} />
      </button>
      {isOpen
        ? createPortal(
            <div
              className="fixed z-50 rounded-md border border-slate-200 bg-white p-1 shadow-xl"
              ref={menuRef}
              role="menu"
              style={{ left: position.left, top: position.top, width: MENU_WIDTH }}
            >
              {actions.map((action) => {
                const className = `${itemClass} ${toneClass[action.tone ?? "default"]}`;
                const content = <>{action.icon}{action.label}</>;

                return action.to ? (
                  <Link className={className} key={action.key} onClick={close} role="menuitem" to={action.to}>
                    {content}
                  </Link>
                ) : (
                  <button
                    className={className}
                    disabled={action.disabled}
                    key={action.key}
                    onClick={() => {
                      close();
                      action.onClick?.();
                    }}
                    role="menuitem"
                    type="button"
                  >
                    {content}
                  </button>
                );
              })}
            </div>,
            document.body,
          )
        : null}
    </>
  );
}
