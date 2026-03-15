import { lazy } from 'react'
import { createBrowserRouter, Navigate } from 'react-router'

import { AppLayout } from '@widgets/layout'

const SearchPage = lazy(() => import('@pages/search'))
const PriceAnalysisPage = lazy(() => import('@pages/price-analysis'))
const CartPage = lazy(() => import('@pages/cart'))
const NotFoundPage = lazy(() => import('@pages/not-found'))

export const router = createBrowserRouter([
  {
    element: <AppLayout />,
    children: [
      { index: true, element: <Navigate to="/search" replace /> },
      { path: 'search', element: <SearchPage /> },
      { path: 'price-analysis/:cteId', element: <PriceAnalysisPage /> },
      { path: 'cart', element: <CartPage /> },
      { path: '*', element: <NotFoundPage /> },
    ],
  },
])
