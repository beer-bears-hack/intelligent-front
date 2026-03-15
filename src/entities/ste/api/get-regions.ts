import { stringArray } from '@/shared/contracts'

import { api } from '@shared/api/axios-instance'

export async function getRegions(): Promise<string[]> {
  const { data } = await api.get<string[]>('/regions')
  return stringArray.parse(data)
}
