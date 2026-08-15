import { useMutation, useQueryClient } from '@tanstack/react-query'
import { createQuickEntry, type QuickEntryPayload } from '../services/workOrdersService'

export const workOrdersQueryKeys = {
  all: ['work-orders'] as const,
}

export const useCreateQuickEntry = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (payload: QuickEntryPayload) => createQuickEntry(payload),
    onSuccess: () => {
      void queryClient.invalidateQueries({
        queryKey: workOrdersQueryKeys.all,
      })
    },
  })
}
