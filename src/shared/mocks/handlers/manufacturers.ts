import { http, HttpResponse, delay } from 'msw'

const manufacturers = [
  { value: 'HP', label: 'HP' },
  { value: 'Dell', label: 'Dell' },
  { value: 'Samsung', label: 'Samsung' },
  { value: 'Logitech', label: 'Logitech' },
  { value: 'Lenovo', label: 'Lenovo' },
]

export const manufacturersHandlers = [
  http.get('/api/manufacturers', async () => {
    await delay(200)
    return HttpResponse.json({ manufacturers })
  }),
]
