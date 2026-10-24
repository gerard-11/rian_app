import { z } from 'zod'

export const createEmployeeSchema = z.object({
  name: z.string().trim().min(2, 'Ingresa el nombre del empleado'),
  email: z.email('Ingresa un correo valido'),
  password: z.string().min(8, 'La contrasena debe tener al menos 8 caracteres'),
  confirmPassword: z.string().min(1, 'Confirma la contrasena'),
}).refine((values) => values.password === values.confirmPassword, {
  message: 'Las contrasenas no coinciden',
  path: ['confirmPassword'],
})

export type CreateEmployeeFormValues = z.infer<typeof createEmployeeSchema>
