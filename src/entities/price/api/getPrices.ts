import { api } from '@shared/api/axiosInstance'

import type { PricesResponse } from '../model/types'

export async function getPrices(
  steId: string,
  params?: { region?: string; period?: number },
): Promise<PricesResponse> {
  const { data } = await api.get<PricesResponse>(`/ste/${steId}/prices`, { params })
  return data
}
