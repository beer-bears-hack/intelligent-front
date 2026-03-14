import { z } from 'zod'

import { api } from '@shared/api/axios-instance'
import { manufacturersResponseSchema } from '@shared/contracts'

type ManufacturersResponse = z.infer<typeof manufacturersResponseSchema>

export async function getManufacturers(): Promise<ManufacturersResponse> {
  const { data } = await api.get('/manufacturers')
  return manufacturersResponseSchema.parse(data)
}
