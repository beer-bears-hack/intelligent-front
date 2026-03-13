import type { AddItemRequest, AddItemResponse } from '@entities/session'

import { api } from '@shared/api/axiosInstance'

export async function addToCart(sessionId: string, item: AddItemRequest): Promise<AddItemResponse> {
  const { data } = await api.post<AddItemResponse>(`/sessions/${sessionId}/items`, item)
  return data
}
