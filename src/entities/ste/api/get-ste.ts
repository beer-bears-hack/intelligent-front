import { api } from '@shared/api/axios-instance'

import type { SteItem } from '../model/types'

export async function getSte(steId: string): Promise<SteItem> {
  const { data } = await api.get<SteItem>(`/ste/${steId}`)
  return data
}
