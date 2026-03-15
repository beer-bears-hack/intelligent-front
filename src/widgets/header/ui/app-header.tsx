import { SearchOutlined, ProfileOutlined } from '@ant-design/icons'
import { useQuery } from '@tanstack/react-query'
import { Grid, Layout, Menu, Badge } from 'antd'
import { useNavigate, useLocation } from 'react-router'

import { useSessionStore, getSession } from '@entities/session'

import { useIsMobile } from '@shared/lib/use-is-mobile'

const { useBreakpoint } = Grid

function getContainerWidth(screens: ReturnType<typeof useBreakpoint>): string {
  if (screens.xxl) return '1600px'
  if (screens.xl) return '1280px'
  if (screens.lg) return '1024px'
  if (screens.md) return '720px'
  return '100%'
}

export function AppHeader() {
  const navigate = useNavigate()
  const location = useLocation()
  const sessionId = useSessionStore((s) => s.sessionId)
  const screens = useBreakpoint()
  const isMobile = useIsMobile()

  const { data: itemCount = 0 } = useQuery({
    queryKey: ['session', sessionId],
    queryFn: () => getSession(sessionId!),
    enabled: !!sessionId,
    select: (data) => data.session.items.length,
  })

  const navItems = [
    { key: '/search', icon: <SearchOutlined />, label: 'Поиск' },
    {
      key: '/cart',
      icon: <ProfileOutlined />,
      label: (
        <Badge count={itemCount} size="small" offset={[8, 0]}>
          Заказ
        </Badge>
      ),
    },
  ]

  return (
    <Layout.Header
      style={{
        display: 'flex',
        justifyContent: 'center',
        padding: 0,
        background: '#E7EEF7',
        overflow: 'hidden',
        maxWidth: '100vw',
      }}
    >
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          maxWidth: getContainerWidth(screens),
          width: '100%',
          padding: '0 24px',
        }}
      >
        <img
          src="/assets/logo.png"
          alt="Портал Поставщиков"
          style={{ height: 32, cursor: 'pointer', marginRight: 40 }}
          onClick={() => navigate('/search')}
        />
        {!isMobile && (
          <Menu
            mode="horizontal"
            selectedKeys={[location.pathname]}
            items={navItems}
            onClick={({ key }) => navigate(key)}
            style={{ flex: 1, border: 'none' }}
          />
        )}
      </div>
    </Layout.Header>
  )
}
