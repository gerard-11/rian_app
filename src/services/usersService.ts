import api from './api'
import type { UserRole } from './authService'

export type CreateUserPayload = {
  name: string
  email: string
  password: string
  role?: UserRole
}

export type CreateUserResponse = {
  user?: {
    id?: number | string
    name?: string
    email?: string
    role?: UserRole
  }
  [key: string]: unknown
}

export const createUser = async (payload: CreateUserPayload) => {
  const response = await api.post<CreateUserResponse>('/users', payload)

  return response.data
}
