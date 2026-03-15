import { http, HttpResponse } from 'msw'

import { pricesBySteId, generateFallbackPrices } from '../data/price-entries'

export const calculateHandlers = [
  // POST /api/calculate/item
  http.post('/api/calculate/item', async ({ request }) => {
    const body = (await request.json()) as {
      quantity: number
      items: Array<
        | { contractId: string; cteId: string; isOutlier?: boolean; similarity: number }
        | { price: number; reason: string; similarity: number }
      >
      method: string
      region?: string
    }

    // Gather selected prices from all STE data
    const allPrices = [
      ...Object.values(pricesBySteId).flat(),
      ...generateFallbackPrices('fallback'),
    ]

    const selectedPrices: number[] = []
    for (const item of body.items) {
      if ('contractId' in item) {
        const found = allPrices.find((p) => String(p.contractId) === item.contractId)
        if (found) selectedPrices.push(found.price)
      } else {
        selectedPrices.push(item.price)
      }
    }

    if (selectedPrices.length === 0) {
      return HttpResponse.json({ error: 'No prices selected' }, { status: 400 })
    }

    const mean = selectedPrices.reduce((a, b) => a + b, 0) / selectedPrices.length
    const variance =
      selectedPrices.reduce((sum, p) => sum + (p - mean) ** 2, 0) / selectedPrices.length
    const stdDev = Math.sqrt(variance)
    const coeffVariation = mean > 0 ? (stdDev / mean) * 100 : 0

    const unitPrice = Math.round(mean * 100) / 100
    const totalPrice = Math.round(unitPrice * body.quantity * 100) / 100

    return HttpResponse.json({
      unitPrice,
      totalPrice,
      priceRange: {
        min: Math.min(...selectedPrices),
        max: Math.max(...selectedPrices),
      },
      coeffVariation: Math.round(coeffVariation * 100) / 100,
      isHomogeneous: coeffVariation <= 33,
      quantity: body.quantity,
      effectiveSampleSize: selectedPrices.length,
      outliersRemoved: 0,
      noDataReason: null,
    })
  }),

  // POST /api/calculate/save
  http.post('/api/calculate/save', () => HttpResponse.json(`item-${Date.now()}`)),
]
