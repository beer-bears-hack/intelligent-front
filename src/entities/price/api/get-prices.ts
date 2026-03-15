import type { PricesResponse } from '@/shared/contracts'

import { api } from '@shared/api/axios-instance'

export async function getPrices(
  steId: string,
  params?: { region?: string; period?: number },
): Promise<PricesResponse> {
  const { data } = await api.get<PricesResponse>(`/ste/${steId}/prices`, { params })
  return data
}
