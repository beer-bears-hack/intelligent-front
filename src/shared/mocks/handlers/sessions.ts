import { http, HttpResponse } from 'msw'

import { cartStore } from '../data/cart-store'

let sessionCounter = 1

export const sessionHandlers = [
  // POST /api/sessions — create session
  http.post('/api/sessions', () => {
    const sessionId = `mock-session-${sessionCounter++}`
    cartStore.ensureSession(sessionId)
    return HttpResponse.json({
      sessionId: sessionId,
      createdAt: new Date().toISOString(),
    })
  }),

  // GET /api/sessions/:sid — get session state
  http.get('/api/sessions/:sid', ({ params }) => {
    const sid = params.sid as string
    const items = cartStore.getItems(sid)
    return HttpResponse.json({
      items,
      total_price: cartStore.getTotal(sid),
    })
  }),
]
