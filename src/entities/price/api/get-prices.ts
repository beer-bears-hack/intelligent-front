import type { PricesResponse } from '@/shared/contracts'

import { api } from '@shared/api/axios-instance'

export async function getPrices(
  cteId: string,
  params?: { region?: string; period?: number },
): Promise<PricesResponse> {
  const { data } = await api.get<PricesResponse>(`/cte/${cteId}/prices`, { params })
  return data
}
