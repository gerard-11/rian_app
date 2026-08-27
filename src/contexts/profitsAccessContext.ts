import { createContext } from "react";

export type ProfitsAccessContextValue = {
  isProfitsUnlocked: boolean;
  lockProfits: () => void;
  unlockProfits: (code: string) => boolean;
};

export const PROFITS_ACCESS_STORAGE_KEY = "rian-profits-unlocked";

export const PROFITS_ACCESS_CODE =
  import.meta.env.VITE_PROFITS_ACCESS_CODE ?? "1234";

export const ProfitsAccessContext = createContext<
  ProfitsAccessContextValue | undefined
>(undefined);
