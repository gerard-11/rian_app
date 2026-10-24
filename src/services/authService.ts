import api from './api'

export type LoginPayload = {
  email: string
  password: string
  [key: string]: unknown
}

export type UserRole = 'ADMIN' | 'EMPLOYEE'

export type LoginResponse = {
  user?: unknown
  [key: string]: unknown
}

export type AuthenticatedUser = {
  id?: number | string
  name?: string
  email?: string
  role?: UserRole
}

export type CurrentUserResponse = {
  user?: AuthenticatedUser
  [key: string]: unknown
}

export const login = async (payload: LoginPayload) => {
  const response = await api.post<LoginResponse>('/auth/login', payload)

  return response.data
}

export const logout = async () => {
  const response = await api.post('/auth/logout')

  return response.data
}

export const getCurrentUser = async () => {
  const response = await api.get<CurrentUserResponse>('/auth/me')

  return response.data
}
