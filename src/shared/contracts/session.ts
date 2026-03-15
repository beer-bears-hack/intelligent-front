import { z } from 'zod'

export const createSessionResponseSchema = z.object({
  sessionId: z.string().nonempty(),
  createdAt: z.string().nullish(),
})
export type CreateSessionResponse = z.infer<typeof createSessionResponseSchema>

export const sessionItem = z.object({
  name: z.string(),
  category: z.string(),
  quantity: z.number(),
  unitPrice: z.number(),
  totalPrice: z.number(),
})
export type SessionItem = z.infer<typeof sessionItem>

export const session = z.object({
  id: z.string().nonempty(),
  createdAt: z.string().nullish(),
  session: z.object({
    items: z.array(sessionItem),
  }),
})
export type Session = z.infer<typeof session>
