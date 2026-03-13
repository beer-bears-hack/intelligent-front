import { api } from '@shared/api/axiosInstance'

import type { GenerateDocumentRequest, GenerateDocumentResponse } from '../model/types'

export async function generateDocument(
  params: GenerateDocumentRequest,
): Promise<GenerateDocumentResponse> {
  const { data } = await api.post<GenerateDocumentResponse>('/documents/generate', params)
  return data
}
