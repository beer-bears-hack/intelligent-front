import { z } from 'zod'

export const createSessionResponseSchema = z.object({
  session_id: z.string().min(1),
})

export type CreateSessionResponse = z.infer<typeof createSessionResponseSchema>
