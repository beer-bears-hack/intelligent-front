export interface SteItem {
  ste_id: string
  name: string
  characteristics: Record<string, string | number>
  similarity_score: number
  category: string
  kpgz_code?: string
  kpgz_name?: string
}

export interface SearchRequest {
  query: string
  region_code?: string
}

export interface SearchResponse {
  results: SteItem[]
}
