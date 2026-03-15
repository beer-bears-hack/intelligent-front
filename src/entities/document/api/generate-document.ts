import { api } from '@shared/api/axios-instance'
import type { GenerateDocumentRequest, GenerateDocumentResponse } from '@shared/contracts'

export async function generateDocument(
  params: GenerateDocumentRequest,
): Promise<GenerateDocumentResponse> {
  const { data } = await api.post<GenerateDocumentResponse>('/documents/generate', params)
  return data
}
