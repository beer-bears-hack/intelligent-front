import { api } from '@shared/api/axios-instance'
import type { SaveItemRequest, SaveItemResponse } from '@shared/contracts'

export async function addToCart(
  sessionId: string,
  item: SaveItemRequest,
): Promise<SaveItemResponse> {
  const { data } = await api.post<SaveItemResponse>(`/sessions/${sessionId}/items`, item)
  return data
}
