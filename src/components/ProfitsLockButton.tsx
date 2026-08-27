import { LockKeyhole } from "lucide-react";
import { useProfitsAccess } from "../hooks/useProfitsAccess";

export function ProfitsLockButton() {
  const { isProfitsUnlocked, lockProfits } = useProfitsAccess();

  if (!isProfitsUnlocked) {
    return null;
  }

  return (
    <button
      className="flex h-10 items-center gap-2 rounded-md border border-[#d71920]/40 bg-white px-3 text-sm font-semibold text-[#a41218] transition hover:bg-[#d71920]/10 focus:outline-none focus:ring-2 focus:ring-[#d71920]/30 focus:ring-offset-2"
      onClick={lockProfits}
      type="button"
    >
      <LockKeyhole className="h-4 w-4" />
      Bloquear
    </button>
  );
}
