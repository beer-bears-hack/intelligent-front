import { http, HttpResponse, delay } from 'msw'

export const regionsHandlers = [
  http.get('/api/regions', async () => {
    await delay(200)
    return HttpResponse.json([
      'Пермский край',
      'Свердловская область',
      'Челябинская область',
      'Москва',
      'Санкт-Петербург',
    ])
  }),
]
