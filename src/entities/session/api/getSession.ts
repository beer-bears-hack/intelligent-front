import { api } from '@shared/api/axiosInstance'

import type { SessionState } from '../model/types'

export async function getSession(sessionId: string): Promise<SessionState> {
  const { data } = await api.get<SessionState>(`/sessions/${sessionId}`)
  return data
}
