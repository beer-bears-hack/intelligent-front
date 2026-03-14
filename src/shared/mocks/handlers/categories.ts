import { http, HttpResponse, delay } from 'msw'

import { steItems } from '../data/search-results'

const categories = [...new Set(steItems.map((item) => item.category))].map((c) => ({
  value: c,
  label: c,
}))

export const categoriesHandlers = [
  http.get('/api/categories', async () => {
    await delay(200)
    return HttpResponse.json({ categories })
  }),
]
