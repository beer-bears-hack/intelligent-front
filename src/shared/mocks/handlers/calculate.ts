import { http, HttpResponse } from 'msw'

import { pricesBySteId, generateFallbackPrices } from '../data/price-entries'

export const calculateHandlers = [
  // POST /api/calculate/item
  http.post('/api/calculate/item', async ({ request }) => {
    const body = (await request.json()) as {
      quantity: number
      selected_price_ids: number[]
      manual_prices?: { price: number; source: string }[]
      method: string
    }

    // Gather selected prices from all STE data
    const allPrices = [
      ...Object.values(pricesBySteId).flat(),
      ...generateFallbackPrices('fallback'),
    ]

    const selectedPrices = allPrices
      .filter((p) => body.selected_price_ids.includes(p.id))
      .map((p) => p.price)

    // Add manual prices
    if (body.manual_prices) {
      for (const mp of body.manual_prices) {
        selectedPrices.push(mp.price)
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
      unit_price: unitPrice,
      total_price: totalPrice,
      price_range: {
        min: Math.min(...selectedPrices),
        max: Math.max(...selectedPrices),
      },
      coeff_variation: Math.round(coeffVariation * 100) / 100,
      is_homogeneous: coeffVariation <= 33,
    })
  }),
]
