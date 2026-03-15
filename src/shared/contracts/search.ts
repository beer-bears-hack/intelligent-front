import { z } from 'zod'

export const searchRequest = z.object({
  query: z.string(),
  category: z.string().nullish(),
  manufacturer: z.string().nullish(),
})
export type SearchRequest = z.infer<typeof searchRequest>

export const priceDto = z.object({
  contractId: z.number().int(),
  price: z.number(),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/), // ISO date
  source: z.string(),
  isOutlier: z.boolean().nullish(),
  reason: z.string().nullish(),
})
export type Price = z.infer<typeof priceDto>

export const searchResult = z.object({
  cteId: z.string(),
  name: z.string(),
  characteristics: z.record(z.string(), z.string()),
  similarityScore: z.number(),
  category: z.string(),
  kpgzCode: z.string().nullish(),
  kpgzName: z.string().nullish(),
  prices: z.array(priceDto),
})
export type SearchResult = z.infer<typeof searchResult>

export const searchResultArray = z.array(searchResult)
export type SearchResultArray = z.infer<typeof searchResultArray>

export const searchResponse = z.object({
  results: searchResultArray,
})
export type SearchResponse = z.infer<typeof searchResponse>

export const steDto = z.object({
  id: z.number(),
  cteId: z.string(),
  cteName: z.string(),
  category: z.string().nullish(),
  manufacturer: z.string().nullish(),
  characteristics: z.string().nullish(),
})
export type SteInfo = z.infer<typeof steDto>

export const pricesResponse = z.object({
  current: steDto,
  results: searchResultArray,
})
export type PricesResponse = z.infer<typeof pricesResponse>
