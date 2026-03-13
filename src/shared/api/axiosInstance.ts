import axios from 'axios'

import { env } from '@shared/config/env'
import { SESSION_STORAGE_KEY } from '@shared/constants'

export const api = axios.create({
  baseURL: env.API_BASE_URL,
  headers: { 'Content-Type': 'application/json' },
})

api.interceptors.request.use((config) => {
  try {
    const raw = localStorage.getItem(SESSION_STORAGE_KEY)
    if (raw) {
      const parsed: unknown = JSON.parse(raw)
      if (
        typeof parsed === 'object' &&
        parsed !== null &&
        'state' in parsed &&
        typeof parsed.state === 'object' &&
        parsed.state !== null &&
        'sessionId' in parsed.state &&
        typeof parsed.state.sessionId === 'string'
      ) {
        config.headers['X-Session-Id'] = parsed.state.sessionId
      }
    }
  } catch {
    // ignore parse errors
  }
  return config
})
