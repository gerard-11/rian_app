import api from './api'

export type LoginPayload = {
  email: string
  password: string
  [key: string]: unknown
}

export type LoginResponse = {
  user?: unknown
  [key: string]: unknown
}

export const login = async (payload: LoginPayload) => {
  const response = await api.post<LoginResponse>('/auth/login', payload)

  return response.data
}
