import { z } from 'zod'

export const searchRequestSchema = z.object({
  query: z.string().min(1),
  category: z.string().optional(),
  manufacturer: z.string().optional(),
  region_code: z.string().optional(),
})

export type SearchRequest = z.infer<typeof searchRequestSchema>

export const steItemSchema = z.object({
  ste_id: z.string(),
  name: z.string(),
  characteristics: z.record(z.string(), z.union([z.string(), z.number()])),
  similarity_score: z.number(),
  category: z.string(),
  kpgz_code: z.string().optional(),
  kpgz_name: z.string().optional(),
})

export type SteItem = z.infer<typeof steItemSchema>

export const searchResponseSchema = z.object({
  results: z.array(steItemSchema),
})

export type SearchResponse = z.infer<typeof searchResponseSchema>

export const filterOptionSchema = z.object({
  value: z.string(),
  label: z.string(),
})

export const categoriesResponseSchema = z.object({
  categories: z.array(filterOptionSchema),
})

export const manufacturersResponseSchema = z.object({
  manufacturers: z.array(filterOptionSchema),
})
