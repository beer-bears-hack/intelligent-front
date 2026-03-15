import { api } from '@shared/api/axios-instance'

export async function updateItem(
  sessionId: string,
  itemId: string,
  updates: { quantity?: number; unitPrice?: number },
): Promise<void> {
  await api.put(`/sessions/${sessionId}/items/${itemId}`, updates)
}
