import type { Session } from '@/shared/contracts'

import { api } from '@shared/api/axios-instance'

export async function getSession(sessionId: string): Promise<Session> {
  const { data } = await api.get<Session>(`/sessions/${sessionId}`)
  return data
}
