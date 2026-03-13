import { Layout } from 'antd'
import { Outlet } from 'react-router'

import { AppHeader } from '@widgets/header'

export function AppLayout() {
  return (
    <Layout style={{ minHeight: '100vh' }}>
      <AppHeader />
      <Layout.Content>
        <Outlet />
      </Layout.Content>
    </Layout>
  )
}
