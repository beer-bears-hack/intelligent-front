import { z } from 'zod'

export const documentSettings = z.object({
  includeCoverPage: z.boolean(),
  signerName: z.string().optional(),
})
export type DocumentSettings = z.infer<typeof documentSettings>

export const generateDocumentRequest = z.object({
  sessionId: z.string(),
  settings: documentSettings,
})
export type GenerateDocumentRequest = z.infer<typeof generateDocumentRequest>

export const generateDocumentResponse = z.object({
  fileUrl: z.string(),
  generatedAt: z.string(),
})
export type GenerateDocumentResponse = z.infer<typeof generateDocumentResponse>
