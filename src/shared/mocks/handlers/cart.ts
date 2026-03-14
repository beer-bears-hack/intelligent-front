import { http, HttpResponse } from 'msw'

import { cartStore } from '../data/cart-store'

export const cartHandlers = [
  // POST /api/sessions/:sid/items — add item to cart
  http.post('/api/sessions/:sid/items', async ({ params, request }) => {
    const sid = params.sid as string
    const body = (await request.json()) as {
      ste_id: string | null
      name: string
      quantity: number
      unit_price: number
      total_price: number
      justification_data?: {
        used_contract_ids: number[]
        manual_prices: { price: number; source: string }[]
      }
    }

    cartStore.ensureSession(sid)
    const item = cartStore.addItem(sid, {
      ste_id: body.ste_id,
      name: body.name,
      quantity: body.quantity,
      unit_price: body.unit_price,
      total_price: body.total_price,
      justification_data: body.justification_data,
    })

    return HttpResponse.json({
      item_id: item.item_id,
      cart_total: cartStore.getTotal(sid),
    })
  }),

  // PUT /api/sessions/:sid/items/:itemId — update item
  http.put('/api/sessions/:sid/items/:itemId', async ({ params, request }) => {
    const sid = params.sid as string
    const itemId = params.itemId as string
    const updates = (await request.json()) as { quantity?: number; unit_price?: number }

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
