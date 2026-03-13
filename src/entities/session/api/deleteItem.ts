import { api } from '@shared/api/axiosInstance'

export async function deleteItem(sessionId: string, itemId: string): Promise<void> {
  await api.delete(`/sessions/${sessionId}/items/${itemId}`)
}
