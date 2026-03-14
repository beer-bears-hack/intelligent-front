import { http, HttpResponse, delay } from 'msw'

import { steItems } from '../data/search-results'

export const searchHandlers = [
  // POST /api/search
  http.post('/api/search', async ({ request }) => {
    await delay(300)

    const body = (await request.json()) as {
      query: string
      category?: string
      manufacturer?: string
      region_code?: string
    }
    const q = body.query.toLowerCase()

    let results = steItems.filter(
      (item) =>
        item.name.toLowerCase().includes(q) ||
        item.category.toLowerCase().includes(q) ||
        (item.kpgz_name?.toLowerCase().includes(q) ?? false),
    )

    if (body.category) {
      results = results.filter((item) => item.category === body.category)
    }

    if (body.manufacturer) {
      results = results.filter((item) => {
        const brand = item.characteristics['brand']
        return typeof brand === 'string' && brand === body.manufacturer
      })
    }

    return HttpResponse.json({ results })
  }),
]
