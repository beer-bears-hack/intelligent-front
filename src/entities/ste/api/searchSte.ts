import { api } from '@shared/api/axiosInstance'

import type { SearchRequest, SearchResponse } from '../model/types'

export async function searchSte(params: SearchRequest): Promise<SearchResponse> {
  const { data } = await api.post<SearchResponse>('/search', params)
  return data
}
