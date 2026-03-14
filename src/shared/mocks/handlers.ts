import { calculateHandlers } from './handlers/calculate'
import { cartHandlers } from './handlers/cart'
import { documentHandlers } from './handlers/documents'
import { priceHandlers } from './handlers/prices'
import { searchHandlers } from './handlers/search'
import { sessionHandlers } from './handlers/sessions'

export const handlers = [
  ...sessionHandlers,
  ...cartHandlers,
  ...searchHandlers,
  ...priceHandlers,
  ...calculateHandlers,
  ...documentHandlers,
]
