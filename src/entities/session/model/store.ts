import { create } from 'zustand'
import { persist } from 'zustand/middleware'

import { api } from '@shared/api/axios-instance'
import { SESSION_STORAGE_KEY } from '@shared/constants'

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
          const { data } = await api.post<{ session_id: string }>('/sessions')
          set({ sessionId: data.session_id, isCreating: false })
          return data.session_id
        } catch (error) {
          set({ isCreating: false })
          throw error
        }
      },
    }),
    {
      name: SESSION_STORAGE_KEY,
      partialize: (state) => ({ sessionId: state.sessionId }),
    },
  ),
)
