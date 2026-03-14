import { z } from 'zod'

import { api } from '@shared/api/axios-instance'
import { categoriesResponseSchema } from '@shared/contracts'

type CategoriesResponse = z.infer<typeof categoriesResponseSchema>

export async function getCategories(): Promise<CategoriesResponse> {
  const { data } = await api.get('/categories')
  return categoriesResponseSchema.parse(data)
}
