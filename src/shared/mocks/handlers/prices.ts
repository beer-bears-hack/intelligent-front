import { http, HttpResponse } from 'msw'

import { pricesBySteId, generateFallbackPrices } from '../data/price-entries'

export const priceHandlers = [
  // GET /api/ste/:steId/prices
  http.get('/api/ste/:steId/prices', ({ params }) => {
    const steId = params.steId as string
    const prices = pricesBySteId[steId] ?? generateFallbackPrices(steId)

    return HttpResponse.json({
      ste_id: steId,
      prices,
    })
  }),
]
