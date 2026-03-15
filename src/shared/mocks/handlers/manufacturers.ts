import { http, HttpResponse, delay } from 'msw'

export const manufacturersHandlers = [
  http.get('/api/manufacturers', async () => {
    await delay(200)
    return HttpResponse.json(['HP', 'Dell', 'Samsung', 'Logitech', 'Lenovo'])
  }),
]
