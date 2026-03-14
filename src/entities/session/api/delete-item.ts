import { api } from '@shared/api/axios-instance'

export async function deleteItem(sessionId: string, itemId: string): Promise<void> {
  await api.delete(`/sessions/${sessionId}/items/${itemId}`)
}
