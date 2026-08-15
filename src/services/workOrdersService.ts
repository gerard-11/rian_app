import api from './api'

export type QuickEntryPayload = {
  [key: string]: unknown
}

export type QuickEntryResponse = {
  [key: string]: unknown
}

export const createQuickEntry = async (payload: QuickEntryPayload) => {
  const response = await api.post<QuickEntryResponse>(
    '/work-orders/quick-entry',
    payload,
  )

  return response.data
}
