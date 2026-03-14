import { api } from '@shared/api/axios-instance'

import type { SessionState } from '../model/types'

export async function getSession(sessionId: string): Promise<SessionState> {
  const { data } = await api.get<SessionState>(`/sessions/${sessionId}`)
  return data
}
