import { useState, type ReactNode } from "react";
import { ArrowLeft, Eye, EyeOff, LockKeyhole, ShieldCheck } from "lucide-react";
import { Link } from "react-router-dom";
import { useProfitsAccess } from "../hooks/useProfitsAccess";

type ProfitsAccessGuardProps = {
  children: ReactNode;
};

export function ProfitsAccessGuard({ children }: ProfitsAccessGuardProps) {
  const { isProfitsUnlocked, unlockProfits } = useProfitsAccess();
  const [code, setCode] = useState("");
  const [error, setError] = useState("");
  const [showCode, setShowCode] = useState(false);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (unlockProfits(code)) {
      setError("");
      setCode("");
      return;
    }

    setError("Clave incorrecta.");
  };

  if (isProfitsUnlocked) {
    return children;
  }

  return (
    <section className="mx-auto flex min-h-[calc(100vh-12rem)] w-full max-w-md items-center">
      <form
        className="w-full rounded-md border border-slate-200 bg-white p-6 shadow-sm"
        onSubmit={handleSubmit}
      >
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-md bg-[#4169e1]/10 text-[#4169e1]">
            <LockKeyhole className="h-5 w-5" />
          </div>
          <div>
            <p className="text-sm font-semibold uppercase text-[#d71920]">
              Acceso restringido
            </p>
            <h2 className="mt-1 text-xl font-bold text-slate-950">Ganancias</h2>
          </div>
        </div>

        <div className="mt-6">
          <label
            className="text-sm font-semibold text-slate-800"
            htmlFor="profitsAccessCode"
          >
            Clave
          </label>
          <div className="relative mt-2">
            <input
              aria-invalid={Boolean(error)}
              className="h-11 w-full rounded-md border border-slate-300 bg-white px-3 pr-12 text-sm text-slate-950 outline-none transition placeholder:text-slate-400 focus:border-[#4169e1] focus:ring-4 focus:ring-[#4169e1]/15"
              id="profitsAccessCode"
              inputMode="text"
              onChange={(event) => {
                setCode(event.target.value);
                setError("");
              }}
              type={showCode ? "text" : "password"}
              value={code}
            />
            <button
              aria-label={showCode ? "Ocultar clave" : "Mostrar clave"}
              className="absolute right-1 top-1 flex h-9 w-9 items-center justify-center rounded-md text-slate-500 transition hover:bg-slate-100 hover:text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#4169e1]/30"
              onClick={() => setShowCode((currentValue) => !currentValue)}
              title={showCode ? "Ocultar clave" : "Mostrar clave"}
              type="button"
            >
              {showCode ? (
                <EyeOff className="h-4 w-4" />
              ) : (
                <Eye className="h-4 w-4" />
              )}
            </button>
          </div>
          {error ? (
            <p
              className="mt-2 text-sm font-semibold text-[#d71920]"
              role="alert"
            >
              {error}
            </p>
          ) : null}
        </div>

        <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-end">
          <Link
            className="flex h-11 items-center justify-center gap-2 rounded-md border border-slate-300 bg-white px-4 text-sm font-semibold text-slate-700 transition hover:bg-slate-100 focus:outline-none focus:ring-2 focus:ring-[#4169e1] focus:ring-offset-2"
            to="/dashboard"
          >
            <ArrowLeft className="h-4 w-4" />
            Dashboard
          </Link>
          <button
            className="flex h-11 items-center justify-center gap-2 rounded-md bg-[#4169e1] px-4 text-sm font-semibold text-white shadow-lg shadow-[#4169e1]/20 transition hover:bg-[#3658c9] focus:outline-none focus:ring-4 focus:ring-[#4169e1]/25"
            type="submit"
          >
            <ShieldCheck className="h-4 w-4" />
            Entrar
          </button>
        </div>
      </form>
    </section>
  );
}
