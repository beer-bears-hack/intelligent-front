import { http, HttpResponse } from 'msw'

import { pricesBySteId, generateFallbackPrices } from '../data/price-entries'

export const priceHandlers = [
  // GET /api/ste/:steId/prices
  http.get('/api/cte/:cteId/prices', ({ params }) => {
    const steId = params.cteId as string
    const prices = pricesBySteId[steId] ?? generateFallbackPrices(steId)

    return HttpResponse.json({
      cteDto: {
        id: 1,
        cteId: steId,
        cteName: `СТЕ ${steId}`,
        category: 'Офисные принадлежности Офисные принадлежности',
        manufacturer: null,
        characteristics: null,
      },
      results: [
        {
          cteId: steId,
          name: `СТЕ ${steId}`,
          characteristics: {},
          similarityScore: 1,
          category: 'Офисные принадлежности Офисные принадлежности',
          kpgzCode: null,
          kpgzName: null,
          prices,
        },
      ],
    })
  }),
]
