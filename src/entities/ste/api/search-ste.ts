import {
  searchRequest,
  searchResponse,
  type SearchRequest,
  type SearchResponse,
} from '@/shared/contracts'

import { api } from '@shared/api/axios-instance'

export async function searchSte(params: SearchRequest): Promise<SearchResponse> {
  const validated = searchRequest.parse(params)

  const { data } = await api.post<SearchResponse>('/search', validated)

  return searchResponse.parse(data)
}
