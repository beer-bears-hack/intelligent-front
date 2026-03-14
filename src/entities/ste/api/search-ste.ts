import { api } from '@shared/api/axios-instance'
import { searchRequestSchema } from '@shared/contracts'

import type { SearchRequest, SearchResponse } from '../model/types'

export async function searchSte(params: SearchRequest): Promise<SearchResponse> {
  const validated = searchRequestSchema.parse(params)
  const { data } = await api.post<SearchResponse>('/search', validated)
  return data
}
