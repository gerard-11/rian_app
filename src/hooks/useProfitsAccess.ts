import { useContext } from "react";
import { ProfitsAccessContext } from "../contexts/profitsAccessContext";

export const useProfitsAccess = () => {
  const context = useContext(ProfitsAccessContext);

  if (!context) {
    throw new Error(
      "useProfitsAccess must be used within ProfitsAccessProvider",
    );
  }

  return context;
};
