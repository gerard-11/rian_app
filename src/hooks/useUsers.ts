import { useMutation } from '@tanstack/react-query'
import { createUser, type CreateUserPayload } from '../services/usersService'

export const useCreateUser = () =>
  useMutation({
    mutationFn: (payload: CreateUserPayload) => createUser(payload),
  })
