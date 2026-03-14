import { useEffect } from 'react'

import { useSessionStore } from '@entities/session'

export function SessionProvider({ children }: { children: React.ReactNode }) {
  const ensureSession = useSessionStore((s) => s.ensureSession)

  useEffect(() => {
    ensureSession()
  }, [ensureSession])

  return children
}
