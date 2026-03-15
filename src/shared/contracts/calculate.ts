import { z } from 'zod'

export const stePricesParams = z.object({
  steId: z.string(),
  region: z.string().optional(),
})
export type StePricesParams = z.infer<typeof stePricesParams>

export const manualPrice = z.object({
  price: z.number(),
  reason: z.string(),
  similarity: z.number(),
})
export type ManualPrice = z.infer<typeof manualPrice>

export const definedPrice = z.object({
  contractId: z.string(),
  cteId: z.string(),
  isOutlier: z.boolean().nullish(),
  similarity: z.number(),
})
export type DefinedPrice = z.infer<typeof definedPrice>

export const calculateItem = z.union([manualPrice, definedPrice])
export type CalculateItem = z.infer<typeof calculateItem>

export const calculateItemRequest = z.object({
  items: z.array(calculateItem),
  quantity: z.number(),
  method: z.string(),
  region: z.string().optional(),
})
export type CalculateItemRequest = z.infer<typeof calculateItemRequest>

export const calculateItemResponse = z.object({
  unitPrice: z.number(),
  totalPrice: z.number(),
  priceRange: z.object({
    min: z.number(),
    max: z.number(),
  }),
  coeffVariation: z.number(),
  isHomogeneous: z.boolean(),
  quantity: z.number(),
  effectiveSampleSize: z.number(),
  outliersRemoved: z.number().int(),
  noDataReason: z.string().nullish(),
})
export type CalculateItemResponse = z.infer<typeof calculateItemResponse>

export const saveItemRequest = calculateItemResponse.extend({
  cteId: z.string(),
})

export type SaveItemRequest = z.infer<typeof saveItemRequest>

export const saveItemResponse = z.string()
export type SaveItemResponse = z.infer<typeof saveItemResponse>
