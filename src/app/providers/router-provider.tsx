import { Flex, Spin } from 'antd'
import { Suspense } from 'react'
import { RouterProvider as ReactRouterProvider } from 'react-router'

import { router } from '@app/router'

export function RouterProvider() {
  return (
    <Suspense
      fallback={
        <Flex justify="center" align="center" style={{ minHeight: '100dvh' }}>
          <Spin
            size="large"
            style={{ display: 'flex', justifyContent: 'center', marginTop: 120 }}
          />
        </Flex>
      }
    >
      <ReactRouterProvider router={router} />
    </Suspense>
  )
}
