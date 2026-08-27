import axios, { AxiosError } from 'axios'

export const api = axios.create({
  baseURL: import.meta.env.DEV ? import.meta.env.VITE_API_URL : '/api',
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
  withCredentials: true,
})

api.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    if (error.response?.status === 401) {
      window.dispatchEvent(new Event('auth:unauthorized'))
    }

    return Promise.reject(error)
  },
)

export default api
