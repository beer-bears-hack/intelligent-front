import { http, HttpResponse, delay } from 'msw'

import { steItems } from '../data/search-results'

export const categoriesHandlers = [
  http.get('/api/categories', async () => {
    await delay(200)
    const categories = [...new Set(steItems.map((item) => item.category))]
    return HttpResponse.json(categories)
  }),
]
