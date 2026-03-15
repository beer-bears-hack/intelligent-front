import { create } from 'zustand'
import { persist } from 'zustand/middleware'

import { createSessionResponseSchema, type CreateSessionResponse } from '@/shared/contracts'

import { api } from '@shared/api/axios-instance'
import { SESSION_STORAGE_KEY } from '@shared/constants'

interface SessionStore {
  sessionId: string | null
  isCreating: boolean
  ensureSession: () => Promise<string>
  _hydrated: boolean
}

let resolveHydration: () => void
const hydrationPromise = new Promise<void>((resolve) => {
  resolveHydration = resolve
})

const resolveResolveHydr = () => {
  resolveHydration()
}

export const useSessionStore = create<SessionStore>()(
  persist(
    (set, get) => ({
      sessionId: null,
      isCreating: false,
      _hydrated: false,

      ensureSession: async () => {
        await hydrationPromise

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
          set({ sessionId: parsed.sessionId, isCreating: false })
          return parsed.sessionId
        } catch (error) {
          set({ isCreating: false })
          throw error
        }
      },
    }),
    {
      name: SESSION_STORAGE_KEY,
      partialize: (state) => ({ sessionId: state.sessionId }),
      onRehydrateStorage: () => resolveResolveHydr,

      merge: (persisted, current) => {
        const result = createSessionResponseSchema.safeParse(persisted)
        return { ...current, ...(result.success ? { sessionId: result.data.sessionId } : {}) }
      },
    },
  ),
)
