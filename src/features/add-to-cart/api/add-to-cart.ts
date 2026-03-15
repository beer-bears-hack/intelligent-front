import { api } from '@shared/api/axios-instance'
import type { SaveItemRequest, SaveItemResponse } from '@shared/contracts'

export async function addToCart(item: SaveItemRequest): Promise<SaveItemResponse> {
  const { data } = await api.post<SaveItemResponse>(`/calculate/save`, item)
  return data
}
