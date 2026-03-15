import { stringArray, type CategoriesResponse } from '@/shared/contracts'

import { api } from '@shared/api/axios-instance'

export async function getCategories(): Promise<CategoriesResponse> {
  const { data } = await api.get<CategoriesResponse>('/categories')

  return stringArray.parse(data)
}
