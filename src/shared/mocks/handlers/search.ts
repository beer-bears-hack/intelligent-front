import { http, HttpResponse, delay } from 'msw'

import { steItems } from '../data/search-results'

export const searchHandlers = [
  // POST /api/search
  http.post('/api/search', async ({ request }) => {
    await delay(300)

    const body = (await request.json()) as { query: string; region_code?: string }
    const q = body.query.toLowerCase()

    const results = steItems.filter(
      (item) =>
        item.name.toLowerCase().includes(q) ||
        item.category.toLowerCase().includes(q) ||
        (item.kpgz_name?.toLowerCase().includes(q) ?? false),
    )

    return HttpResponse.json({ results })
  }),
]
