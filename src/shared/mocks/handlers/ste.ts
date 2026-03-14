import { delay, http, HttpResponse } from 'msw'

import { steItems } from '../data/search-results'

export const steInfoHandlers = [
  // GET /api/ste/:steId — get ste info
  http.get('/api/ste/:ste_id', async ({ params }) => {
    await delay(300)

    return HttpResponse.json(steItems.find((item) => item.ste_id === params.ste_id) ?? steItems[0])
  }),
]
