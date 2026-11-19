import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { AlertCircle, ArrowLeft, Eye, EyeOff, LoaderCircle, Lock, LogIn, Mail, type LucideIcon } from "lucide-react";
import { useEffect, useState, type InputHTMLAttributes, type ReactNode } from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { z } from "zod";
import { login } from "../services/authService";
import { BUSINESS, LOGO_URL, SHOP_PHOTOS } from "../site/siteConfig";

const loginSchema = z.object({
  email: z.email("Ingresa un correo válido"),
  password: z.string().min(8, "La contraseña debe tener al menos 8 caracteres"),
  remember: z.boolean(),
});

type LoginFormValues = z.infer<typeof loginSchema>;

type FieldProps = InputHTMLAttributes<HTMLInputElement> & {
  id: string;
  label: string;
  icon: LucideIcon;
  error?: string;
  trailing?: ReactNode;
};

function Field({ id, label, icon: Icon, error, trailing, ...inputProps }: FieldProps) {
  return (
    <div>
      <label className="text-sm font-semibold text-slate-800" htmlFor={id}>
        {label}
      </label>
      <div
        className={`mt-1.5 flex h-12 items-center rounded-lg border bg-white px-3 shadow-sm transition focus-within:ring-4 ${
          error
            ? "border-[#d71920] focus-within:ring-[#d71920]/15"
            : "border-slate-300 focus-within:border-[#1D4ED8] focus-within:ring-[#1D4ED8]/15"
        }`}
      >
        <Icon className="h-5 w-5 shrink-0 text-slate-400" />
        <input
          aria-describedby={error ? `${id}-error` : undefined}
          aria-invalid={Boolean(error)}
          className="h-full min-w-0 flex-1 bg-transparent px-3 text-base text-slate-950 outline-none placeholder:text-slate-400"
          id={id}
          {...inputProps}
        />
        {trailing}
      </div>
      {error ? (
        <p className="mt-1.5 text-sm font-medium text-[#a41218]" id={`${id}-error`}>
          {error}
        </p>
      ) : null}
    </div>
  );
}

export function LoginPage() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "", remember: true },
  });

  const loginMutation = useMutation({
    mutationFn: login,
    onSuccess: () => navigate("/dashboard", { replace: true }),
  });

  useEffect(() => {
    document.title = `Acceso del personal | ${BUSINESS.name}`;
  }, []);

  return (
    <main className="grid min-h-dvh grid-cols-1 bg-slate-50 text-slate-950 lg:grid-cols-[minmax(0,1fr)_minmax(480px,1fr)]">
      {/* Panel de marca (solo escritorio) */}
      <section className="relative hidden overflow-hidden bg-slate-900 lg:block">
        <img
          alt=""
          className="absolute inset-0 h-full w-full object-cover opacity-60"
          height={853}
          src={SHOP_PHOTOS.lifts}
          width={640}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/60 to-slate-950/30" />
        <div className="relative flex h-full flex-col justify-between p-10 text-white xl:p-14">
          <span className="self-start rounded-xl bg-white/95 px-4 py-3 shadow-lg">
            <img alt={BUSINESS.name} className="h-12 w-auto" height={48} src={LOGO_URL} width={113} />
          </span>
          <div className="max-w-md">
            <div className="h-1.5 w-20 rounded-full bg-[#B3262D]" />
            <p className="mt-6 text-4xl font-black leading-tight xl:text-5xl">Panel del taller</p>
            <p className="mt-4 text-lg leading-8 text-white/75">
              Presupuestos, órdenes de trabajo, clientes y llantas en un solo lugar.
            </p>
          </div>
        </div>
      </section>

      {/* Formulario */}
      <section className="flex min-h-dvh min-w-0 flex-col px-5 py-6 sm:px-10">
        <Link
          className="inline-flex h-10 items-center gap-2 self-start rounded-lg px-3 text-sm font-semibold text-slate-600 transition hover:bg-slate-200/60 hover:text-slate-950 focus:outline-none focus-visible:ring-4 focus-visible:ring-[#1D4ED8]/20"
          to="/"
        >
          <ArrowLeft className="h-4 w-4" />
          Volver al sitio
        </Link>

        <div className="flex flex-1 items-center justify-center py-4 sm:py-8">
          <div className="w-full max-w-sm">
            <img alt={BUSINESS.name} className="mb-6 h-14 w-auto lg:hidden" height={56} src={LOGO_URL} width={132} />

            <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#B3262D]">Acceso del personal</p>
            <h1 className="mt-2 text-3xl font-black tracking-tight text-slate-950">Inicia sesión</h1>
            <p className="mt-2 text-base text-slate-600">Entra con tu correo y contraseña para continuar al panel.</p>

            <form className="mt-6 space-y-5 sm:mt-8" noValidate onSubmit={handleSubmit((values) => loginMutation.mutate(values))}>
              <Field
                autoComplete="email"
                error={errors.email?.message}
                icon={Mail}
                id="email"
                inputMode="email"
                label="Correo electrónico"
                placeholder="nombre@correo.com"
                type="email"
                {...register("email")}
              />

              <Field
                autoComplete="current-password"
                error={errors.password?.message}
                icon={Lock}
                id="password"
                label="Contraseña"
                placeholder="Tu contraseña"
                trailing={
                  <button
                    aria-label={showPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
                    className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md text-slate-500 transition hover:bg-slate-100 hover:text-slate-950 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#1D4ED8]"
                    onClick={() => setShowPassword((current) => !current)}
                    type="button"
                  >
                    {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                }
                type={showPassword ? "text" : "password"}
                {...register("password")}
              />

              <label className="flex w-fit cursor-pointer items-center gap-2 text-sm font-medium text-slate-700">
                <input className="h-4 w-4 rounded border-slate-300 accent-[#B3262D]" type="checkbox" {...register("remember")} />
                Mantener la sesión iniciada
              </label>

              {loginMutation.isError ? (
                <div
                  className="flex items-start gap-2 rounded-lg border border-[#d71920]/30 bg-[#d71920]/10 px-4 py-3 text-sm font-medium text-[#a41218]"
                  role="alert"
                >
                  <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
                  No se pudo iniciar sesión. Revisa tu correo y contraseña e intenta de nuevo.
                </div>
              ) : null}

              <button
                className="flex h-12 w-full items-center justify-center gap-2 rounded-lg bg-[#B3262D] px-4 text-base font-bold text-white shadow-lg shadow-[#B3262D]/20 transition hover:bg-[#8F1D24] focus:outline-none focus-visible:ring-4 focus-visible:ring-[#B3262D]/25 disabled:cursor-not-allowed disabled:bg-slate-400 disabled:shadow-none"
                disabled={loginMutation.isPending}
                type="submit"
              >
                {loginMutation.isPending ? (
                  <LoaderCircle className="h-5 w-5 animate-spin" />
                ) : (
                  <LogIn className="h-5 w-5" />
                )}
                {loginMutation.isPending ? "Entrando..." : "Iniciar sesión"}
              </button>
            </form>

            <p className="mt-6 text-sm text-slate-500">
              ¿Olvidaste tu contraseña? Pídele al administrador que la restablezca.
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}
