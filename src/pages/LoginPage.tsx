import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { Eye, EyeOff, Lock, LogIn, Mail } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { z } from "zod";
import { login } from "../services/authService";

const loginSchema = z.object({
  email: z.email("Ingresa un correo valido"),
  password: z.string().min(8, "La contrasena debe tener al menos 8 caracteres"),
  remember: z.boolean(),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export function LoginPage() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
      remember: true,
    },
  });

  const loginMutation = useMutation({
    mutationFn: login,
    onSuccess: () => {
      navigate("/dashboard", { replace: true });
    },
  });

  const onSubmit = (values: LoginFormValues) => {
    loginMutation.mutate(values);
  };

  return (
    <main className="min-h-screen bg-slate-50 text-slate-950">
      <div className="grid min-h-screen lg:grid-cols-[minmax(0,0.95fr)_minmax(420px,1.05fr)]">
        <section className="hidden bg-[#B3262D] px-10 py-12 text-white lg:flex lg:flex-col lg:justify-between">
          <div>
            <div className="flex h-11 w-11 items-center justify-center rounded-md bg-white text-xl font-black text-[#B3262D]">
              R
            </div>
            <p className="mt-5 max-w-sm text-sm font-medium leading-6 text-blue-50">
              Gestion operativa con acceso seguro para mantener clientes,
              ordenes y movimientos bajo control.
            </p>
          </div>

          <div className="max-w-lg">
            <div className="mb-6 h-1.5 w-24 rounded-full bg-[#d71920]" />
            <h1 className="text-5xl font-bold leading-tight">
              Accede a Rian App
            </h1>
            <p className="mt-5 text-lg leading-8 text-blue-50">
              Un panel claro para el trabajo diario, con acciones rapidas y
              datos listos para revisar.
            </p>
          </div>
        </section>

        <section className="flex min-h-screen items-center justify-center px-5 py-10 sm:px-8">
          <div className="w-full max-w-[440px]">
            <div className="mb-8 lg:hidden">
              <div className="flex h-11 w-11 items-center justify-center rounded-md bg-[#B3262D] text-xl font-black text-white">
                R
              </div>
              <div className="mt-4 h-1.5 w-20 rounded-full bg-[#d71920]" />
            </div>

            <div>
              <p className="text-sm font-semibold uppercase text-[#d71920]">
                Inicio de sesion
              </p>
              <h2 className="mt-3 text-3xl font-bold tracking-normal text-slate-950 sm:text-4xl">
                Entra a tu cuenta
              </h2>
              <p className="mt-3 text-base leading-7 text-slate-600">
                Usa tus credenciales para continuar al panel administrativo.
              </p>
            </div>

            <form className="mt-8 space-y-5" onSubmit={handleSubmit(onSubmit)}>
              <div>
                <label
                  className="text-sm font-semibold text-slate-800"
                  htmlFor="email"
                >
                  Correo electronico
                </label>
                <div className="mt-2 flex h-12 items-center rounded-md border border-slate-300 bg-white px-3 shadow-sm transition focus-within:border-[#B3262D] focus-within:ring-4 focus-within:ring-[#B3262D]/15">
                  <Mail className="h-5 w-5 shrink-0 text-slate-400" />
                  <input
                    aria-invalid={Boolean(errors.email)}
                    autoComplete="email"
                    className="h-full min-w-0 flex-1 bg-transparent px-3 text-base text-slate-950 outline-none placeholder:text-slate-400"
                    id="email"
                    placeholder="nombre@empresa.com"
                    type="email"
                    {...register("email")}
                  />
                </div>
                {errors.email ? (
                  <p className="mt-2 text-sm font-medium text-[#d71920]">
                    {errors.email.message}
                  </p>
                ) : null}
              </div>

              <div>
                <label
                  className="text-sm font-semibold text-slate-800"
                  htmlFor="password"
                >
                  Contrasena
                </label>
                <div className="mt-2 flex h-12 items-center rounded-md border border-slate-300 bg-white px-3 shadow-sm transition focus-within:border-[#B3262D] focus-within:ring-4 focus-within:ring-[#B3262D]/15">
                  <Lock className="h-5 w-5 shrink-0 text-slate-400" />
                  <input
                    aria-invalid={Boolean(errors.password)}
                    autoComplete="current-password"
                    className="h-full min-w-0 flex-1 bg-transparent px-3 text-base text-slate-950 outline-none placeholder:text-slate-400"
                    id="password"
                    placeholder="Tu contrasena"
                    type={showPassword ? "text" : "password"}
                    {...register("password")}
                  />
                  <button
                    aria-label={
                      showPassword ? "Ocultar contrasena" : "Mostrar contrasena"
                    }
                    className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md text-slate-500 transition hover:bg-slate-100 hover:text-slate-950 focus:outline-none focus:ring-2 focus:ring-[#B3262D] focus:ring-offset-2"
                    onClick={() => setShowPassword((current) => !current)}
                    type="button"
                  >
                    {showPassword ? (
                      <EyeOff className="h-5 w-5" />
                    ) : (
                      <Eye className="h-5 w-5" />
                    )}
                  </button>
                </div>
                {errors.password ? (
                  <p className="mt-2 text-sm font-medium text-[#d71920]">
                    {errors.password.message}
                  </p>
                ) : null}
              </div>

              <div className="flex items-center justify-between gap-4">
                <label className="flex items-center gap-2 text-sm font-medium text-slate-700">
                  <input
                    className="h-4 w-4 rounded border-slate-300 text-[#B3262D] focus:ring-[#B3262D]"
                    type="checkbox"
                    {...register("remember")}
                  />
                  Recordarme
                </label>
                <button
                  className="text-sm font-semibold text-[#B3262D] transition hover:text-[#7A1820] focus:outline-none focus:ring-2 focus:ring-[#B3262D] focus:ring-offset-4"
                  type="button"
                >
                  Olvide mi contrasena
                </button>
              </div>

              {loginMutation.isError ? (
                <div className="rounded-md border border-[#d71920]/30 bg-[#d71920]/10 px-4 py-3 text-sm font-medium text-[#a41218]">
                  No se pudo iniciar sesion. Revisa tus credenciales e intenta
                  de nuevo.
                </div>
              ) : null}

              <button
                className="flex h-12 w-full items-center justify-center gap-2 rounded-md bg-[#B3262D] px-4 text-base font-semibold text-white shadow-lg shadow-[#B3262D]/20 transition hover:bg-[#8F1D24] focus:outline-none focus:ring-4 focus:ring-[#B3262D]/25 disabled:cursor-not-allowed disabled:bg-slate-400 disabled:shadow-none"
                disabled={loginMutation.isPending}
                type="submit"
              >
                <LogIn className="h-5 w-5" />
                {loginMutation.isPending ? "Ingresando..." : "Iniciar sesion"}
              </button>
            </form>
          </div>
        </section>
      </div>
    </main>
  );
}
