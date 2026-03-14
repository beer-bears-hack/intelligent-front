import { calculateHandlers } from './calculate'
import { cartHandlers } from './cart'
import { categoriesHandlers } from './categories'
import { documentHandlers } from './documents'
import { manufacturersHandlers } from './manufacturers'
import { priceHandlers } from './prices'
import { searchHandlers } from './search'
import { sessionHandlers } from './sessions'

export const handlers = [
  ...searchHandlers,
  ...categoriesHandlers,
  ...manufacturersHandlers,
  ...sessionHandlers,
  ...cartHandlers,
  ...priceHandlers,
  ...calculateHandlers,
  ...documentHandlers,
]
