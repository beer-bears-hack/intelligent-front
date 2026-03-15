import { calculateHandlers } from './handlers/calculate'
import { cartHandlers } from './handlers/cart'
import { categoriesHandlers } from './handlers/categories'
import { documentHandlers } from './handlers/documents'
import { manufacturersHandlers } from './handlers/manufacturers'
import { priceHandlers } from './handlers/prices'
import { regionsHandlers } from './handlers/regions'
import { searchHandlers } from './handlers/search'
import { sessionHandlers } from './handlers/sessions'
import { steInfoHandlers } from './handlers/ste'

export const handlers = [
  ...sessionHandlers,
  ...cartHandlers,
  ...searchHandlers,
  ...priceHandlers,
  ...calculateHandlers,
  ...documentHandlers,
  ...steInfoHandlers,
  ...categoriesHandlers,
  ...manufacturersHandlers,
  ...regionsHandlers,
]
