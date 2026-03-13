import { Spin } from 'antd'
import { Suspense } from 'react'
import { RouterProvider as ReactRouterProvider } from 'react-router'

import { router } from '@app/router'

export function RouterProvider() {
  return (
    <Suspense
      fallback={
        <Spin size="large" style={{ display: 'flex', justifyContent: 'center', marginTop: 120 }} />
      }
    >
      <ReactRouterProvider router={router} />
    </Suspense>
  )
}
