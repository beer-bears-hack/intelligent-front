import type { CalculateItemRequest, CalculateItemResponse } from '@/shared/contracts'

import { api } from '@shared/api/axios-instance'

export async function calculateItem(params: CalculateItemRequest): Promise<CalculateItemResponse> {
  const { data } = await api.post<CalculateItemResponse>('/calculate/item', params)
  return data
}
