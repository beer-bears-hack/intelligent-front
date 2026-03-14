import { z } from 'zod'
import { create } from 'zustand'
import { persist } from 'zustand/middleware'

import { api } from '@shared/api/axios-instance'
import { SESSION_STORAGE_KEY } from '@shared/constants'
import { type CreateSessionResponse, createSessionResponseSchema } from '@shared/contracts'

interface SessionStore {
  sessionId: string | null
  isCreating: boolean
  ensureSession: () => Promise<string>
}

export const useSessionStore = create<SessionStore>()(
  persist(
    (set, get) => ({
      sessionId: null,
      isCreating: false,

      ensureSession: async () => {
        await useSessionStore.persist.rehydrate()

        const { sessionId, isCreating } = get()
        if (sessionId) return sessionId

        if (isCreating) {
          return new Promise<string>((resolve) => {
            const unsub = useSessionStore.subscribe((state) => {
              if (state.sessionId) {
                unsub()
                resolve(state.sessionId)
              }
            })
          })
        }

        set({ isCreating: true })

        try {
          const { data } = await api.post<CreateSessionResponse>('/sessions')
          const parsed = createSessionResponseSchema.parse(data)
          set({ sessionId: parsed.session_id, isCreating: false })
          return parsed.session_id
        } catch (error) {
          set({ isCreating: false })
          throw error
        }
      },
    }),
    {
      name: SESSION_STORAGE_KEY,
      partialize: (state) => ({ sessionId: state.sessionId }),
      merge: (persisted, current) => {
        const result = z
          .object({
            sessionId: z
              .string()
              .min(1)
              .refine((v) => v !== 'null'),
          })
          .safeParse(persisted)
        return { ...current, ...(result.success ? { sessionId: result.data.sessionId } : {}) }
      },
    },
  ),
)
