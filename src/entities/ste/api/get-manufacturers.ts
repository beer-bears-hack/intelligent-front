import { stringArray, type ManufacturersResponse } from '@/shared/contracts'

import { api } from '@shared/api/axios-instance'

export async function getManufacturers(): Promise<ManufacturersResponse> {
  const { data } = await api.get<ManufacturersResponse>('/manufacturers')

  return stringArray.parse(data)
}
