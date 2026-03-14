import { ShoppingCartOutlined, SearchOutlined, FileTextOutlined } from '@ant-design/icons'
import { useQuery } from '@tanstack/react-query'
import { Layout, Menu, Badge } from 'antd'
import { useNavigate, useLocation } from 'react-router'

import { useSessionStore, getSession } from '@entities/session'

export function AppHeader() {
  const navigate = useNavigate()
  const location = useLocation()
  const sessionId = useSessionStore((s) => s.sessionId)

  const { data: itemCount = 0 } = useQuery({
    queryKey: ['session', sessionId],
    queryFn: () => getSession(sessionId!),
    enabled: !!sessionId,
    select: (data) => data.items.length,
  })

  const navItems = [
    { key: '/search', icon: <SearchOutlined />, label: 'Поиск СТЕ' },
    {
      key: '/cart',
      icon: <ShoppingCartOutlined />,
      label: (
        <Badge count={itemCount} size="small" offset={[8, 0]}>
          Корзина
        </Badge>
      ),
    },
    { key: '/document', icon: <FileTextOutlined />, label: 'Документ' },
  ]

  return (
    <Layout.Header
      style={{
        display: 'flex',
        alignItems: 'center',
        padding: '0 24px',
        background: '#fff',
      }}
    >
      <div
        style={{
          cursor: 'pointer',
          whiteSpace: 'nowrap',
        }}
        onClick={() => navigate('/search')}
      >
        НМЦК Калькулятор
      </div>
      <Menu
        mode="horizontal"
        selectedKeys={[location.pathname]}
        items={navItems}
        onClick={({ key }) => navigate(key)}
        style={{ flex: 1, border: 'none' }}
      />
    </Layout.Header>
  )
}
