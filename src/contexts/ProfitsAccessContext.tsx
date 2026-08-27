import { useCallback, useMemo, useState, type ReactNode } from "react";
import {
  PROFITS_ACCESS_CODE,
  PROFITS_ACCESS_STORAGE_KEY,
  ProfitsAccessContext,
} from "./profitsAccessContext";

const getStoredAccess = () => {
  try {
    return window.sessionStorage.getItem(PROFITS_ACCESS_STORAGE_KEY) === "true";
  } catch {
    return false;
  }
};

const setStoredAccess = (isUnlocked: boolean) => {
  try {
    if (isUnlocked) {
      window.sessionStorage.setItem(PROFITS_ACCESS_STORAGE_KEY, "true");
      return;
    }

    window.sessionStorage.removeItem(PROFITS_ACCESS_STORAGE_KEY);
  } catch {
    // Session persistence is optional; route-level state still protects the view.
  }
};

type ProfitsAccessProviderProps = {
  children: ReactNode;
};

export function ProfitsAccessProvider({
  children,
}: ProfitsAccessProviderProps) {
  const [isProfitsUnlocked, setIsProfitsUnlocked] = useState(getStoredAccess);

  const lockProfits = useCallback(() => {
    setStoredAccess(false);
    setIsProfitsUnlocked(false);
  }, []);

  const unlockProfits = useCallback((code: string) => {
    const isValidCode = code.trim() === PROFITS_ACCESS_CODE;

    if (isValidCode) {
      setStoredAccess(true);
      setIsProfitsUnlocked(true);
    }

    return isValidCode;
  }, []);

  const value = useMemo(
    () => ({
      isProfitsUnlocked,
      lockProfits,
      unlockProfits,
    }),
    [isProfitsUnlocked, lockProfits, unlockProfits],
  );

  return (
    <ProfitsAccessContext.Provider value={value}>
      {children}
    </ProfitsAccessContext.Provider>
  );
}
