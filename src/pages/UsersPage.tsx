import { zodResolver } from '@hookform/resolvers/zod'
import { CheckCircle2, Eye, EyeOff, LoaderCircle, UserPlus } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { useCreateUser } from '../hooks/useUsers'
import {
  createEmployeeSchema,
  type CreateEmployeeFormValues,
} from '../schemas/createEmployeeSchema'
import { useState } from 'react'

const inputClass =
  'mt-2 h-12 w-full rounded-md border border-slate-300 bg-white px-3 text-base text-slate-950 outline-none transition placeholder:text-slate-400 focus:border-[#4169e1] focus:ring-4 focus:ring-[#4169e1]/15'

export function UsersPage() {
  const createUserMutation = useCreateUser()
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CreateEmployeeFormValues>({
    defaultValues: { name: '', email: '', password: '', confirmPassword: '' },
    resolver: zodResolver(createEmployeeSchema),
  })

  const onSubmit = ({ confirmPassword: _confirmPassword, ...values }: CreateEmployeeFormValues) => {
    createUserMutation.mutate(
      { ...values, role: 'EMPLOYEE' },
      { onSuccess: () => reset() },
    )
  }

  return (
    <div className="w-full max-w-3xl">
      <section className="rounded-md border border-slate-200 bg-white shadow-sm">
        <div className="border-b border-slate-200 px-5 py-5 sm:px-6">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-md bg-[#4169e1]/10 text-[#4169e1]">
              <UserPlus className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-950">Crear empleado</h2>
              <p className="mt-1 text-sm text-slate-500">
                El usuario se registrará con el rol EMPLOYEE.
              </p>
            </div>
          </div>
        </div>

        <form className="space-y-5 px-5 py-5 sm:px-6" onSubmit={handleSubmit(onSubmit)}>
          <div>
            <label className="text-sm font-semibold text-slate-800" htmlFor="employeeName">Nombre</label>
            <input className={inputClass} id="employeeName" placeholder="Nombre completo" {...register('name')} />
            {errors.name ? <p className="mt-2 text-sm font-medium text-[#d71920]">{errors.name.message}</p> : null}
          </div>

          <div>
            <label className="text-sm font-semibold text-slate-800" htmlFor="employeeEmail">Correo electronico</label>
            <input className={inputClass} id="employeeEmail" placeholder="empleado@taller.com" type="email" {...register('email')} />
            {errors.email ? <p className="mt-2 text-sm font-medium text-[#d71920]">{errors.email.message}</p> : null}
          </div>

          <div>
            <label className="text-sm font-semibold text-slate-800" htmlFor="employeePassword">Contrasena</label>
            <div className="relative">
              <input className={`${inputClass} pr-12`} id="employeePassword" placeholder="Minimo 8 caracteres" type={showPassword ? 'text' : 'password'} {...register('password')} />
              <button
                aria-label={showPassword ? 'Ocultar contrasena' : 'Mostrar contrasena'}
                className="absolute right-2 top-4 flex h-8 w-8 items-center justify-center rounded-md text-slate-500 transition hover:bg-slate-100 hover:text-slate-950 focus:outline-none focus:ring-2 focus:ring-[#4169e1]"
                onClick={() => setShowPassword((current) => !current)}
                type="button"
              >
                {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
              </button>
            </div>
            {errors.password ? <p className="mt-2 text-sm font-medium text-[#d71920]">{errors.password.message}</p> : null}
          </div>

          <div>
            <label className="text-sm font-semibold text-slate-800" htmlFor="employeeConfirmPassword">Confirmar contrasena</label>
            <div className="relative">
              <input className={`${inputClass} pr-12`} id="employeeConfirmPassword" placeholder="Repite la contrasena" type={showConfirmPassword ? 'text' : 'password'} {...register('confirmPassword')} />
              <button
                aria-label={showConfirmPassword ? 'Ocultar confirmacion de contrasena' : 'Mostrar confirmacion de contrasena'}
                className="absolute right-2 top-4 flex h-8 w-8 items-center justify-center rounded-md text-slate-500 transition hover:bg-slate-100 hover:text-slate-950 focus:outline-none focus:ring-2 focus:ring-[#4169e1]"
                onClick={() => setShowConfirmPassword((current) => !current)}
                type="button"
              >
                {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
              </button>
            </div>
            {errors.confirmPassword ? <p className="mt-2 text-sm font-medium text-[#d71920]">{errors.confirmPassword.message}</p> : null}
          </div>

          {createUserMutation.isError ? (
            <div className="rounded-md border border-[#d71920]/30 bg-[#d71920]/10 px-4 py-3 text-sm font-medium text-[#a41218]" role="alert">
              No se pudo crear el empleado. Verifica que el correo no esté registrado.
            </div>
          ) : null}

          {createUserMutation.isSuccess ? (
            <div className="flex items-center gap-2 rounded-md border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-800" role="status">
              <CheckCircle2 className="h-4 w-4 shrink-0" /> Empleado creado correctamente.
            </div>
          ) : null}

          <button className="flex h-11 items-center justify-center gap-2 rounded-md bg-[#4169e1] px-5 text-sm font-semibold text-white shadow-lg shadow-[#4169e1]/20 transition hover:bg-[#3658c9] disabled:cursor-not-allowed disabled:bg-slate-400 disabled:shadow-none" disabled={createUserMutation.isPending} type="submit">
            {createUserMutation.isPending ? <LoaderCircle className="h-4 w-4 animate-spin" /> : <UserPlus className="h-4 w-4" />}
            {createUserMutation.isPending ? 'Creando empleado...' : 'Crear empleado'}
          </button>
        </form>
      </section>
    </div>
  )
}
