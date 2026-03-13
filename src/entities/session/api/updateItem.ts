import { api } from '@shared/api/axiosInstance'

export async function updateItem(
  sessionId: string,
  itemId: string,
  updates: { quantity?: number; unit_price?: number },
): Promise<void> {
  await api.put(`/sessions/${sessionId}/items/${itemId}`, updates)
}
