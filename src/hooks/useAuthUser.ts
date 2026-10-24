import { useQuery } from '@tanstack/react-query'
import { getCurrentUser } from '../services/authService'

export const authUserQueryKey = ['auth', 'me'] as const

export const useAuthUser = () =>
  useQuery({
    queryFn: getCurrentUser,
    queryKey: authUserQueryKey,
    retry: false,
    staleTime: 5 * 60 * 1000,
  })
