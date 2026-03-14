import { api } from '@shared/api/axios-instance'

import type { CalculateItemRequest, CalculateItemResponse } from '../model/types'

export async function calculateItem(params: CalculateItemRequest): Promise<CalculateItemResponse> {
  const { data } = await api.post<CalculateItemResponse>('/calculate/item', params)
  return data
}
