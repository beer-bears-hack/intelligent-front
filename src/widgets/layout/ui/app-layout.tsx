import { Layout } from 'antd'
import { Outlet } from 'react-router'

import { BottomTabBar } from '@widgets/bottom-tab-bar'
import { AppHeader } from '@widgets/header'

import { useIsMobile } from '@shared/lib/use-is-mobile'

export function AppLayout() {
  const isMobile = useIsMobile()

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <AppHeader />
      <Layout.Content style={isMobile ? { paddingBottom: 56 } : undefined}>
        <Outlet />
      </Layout.Content>
      {isMobile && <BottomTabBar />}
    </Layout>
  )
}
