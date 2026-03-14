import { api } from '@shared/api/axios-instance'

export async function downloadDocument(fileUrl: string): Promise<Blob> {
  const { data } = await api.get<Blob>(fileUrl, { responseType: 'blob' })
  return data
}
