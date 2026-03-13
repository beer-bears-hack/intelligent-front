import { lazy } from 'react'
import { createBrowserRouter, Navigate } from 'react-router'

import { AppLayout } from '@widgets/layout'

const SearchPage = lazy(() => import('@pages/search'))
const PriceAnalysisPage = lazy(() => import('@pages/price-analysis'))
const CartPage = lazy(() => import('@pages/cart'))
const DocumentPage = lazy(() => import('@pages/document'))
const NotFoundPage = lazy(() => import('@pages/not-found'))

export const router = createBrowserRouter([
  {
    element: <AppLayout />,
    children: [
      { index: true, element: <Navigate to="/search" replace /> },
      { path: 'search', element: <SearchPage /> },
      { path: 'price-analysis/:steId', element: <PriceAnalysisPage /> },
      { path: 'cart', element: <CartPage /> },
      { path: 'document', element: <DocumentPage /> },
      { path: '*', element: <NotFoundPage /> },
    ],
  },
])
