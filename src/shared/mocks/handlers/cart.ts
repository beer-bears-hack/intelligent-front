import { http, HttpResponse } from 'msw'

import { cartStore } from '../data/cart-store'

export const cartHandlers = [
  // POST /api/sessions/:sid/items — add item to cart
  http.post('/api/sessions/:sid/items', async ({ params, request }) => {
    const sid = params.sid as string
    const body = (await request.json()) as {
      cteId: string | null
      name: string
      quantity: number
      unitPrice: number
      totalPrice: number
    }

    cartStore.ensureSession(sid)
    const item = cartStore.addItem(sid, {
      name: body.name,
      category: '',
      quantity: body.quantity,
      unitPrice: body.unitPrice,
      totalPrice: body.totalPrice,
    })

    return HttpResponse.json(item)
  }),

  // PUT /api/sessions/:sid/items/:itemId — update item
  http.put('/api/sessions/:sid/items/:itemId', async ({ params, request }) => {
    const sid = params.sid as string
    const itemId = params.itemId as string
    const updates = (await request.json()) as { quantity?: number; unitPrice?: number }

    const updated = cartStore.updateItem(sid, itemId, updates)
    if (!updated) {
      return new HttpResponse(null, { status: 404 })
    }

    return HttpResponse.json(updated)
  }),

  // DELETE /api/sessions/:sid/items/:itemId — delete item
  http.delete('/api/sessions/:sid/items/:itemId', ({ params }) => {
    const sid = params.sid as string
    const itemId = params.itemId as string

    const deleted = cartStore.deleteItem(sid, itemId)
    if (!deleted) {
      return new HttpResponse(null, { status: 404 })
    }

    return new HttpResponse(null, { status: 204 })
  }),
]
