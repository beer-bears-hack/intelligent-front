import { SearchOutlined, ProfileOutlined } from '@ant-design/icons'
import { useQuery } from '@tanstack/react-query'
import { Badge } from 'antd'
import type { ReactNode } from 'react'
import { useNavigate, useLocation } from 'react-router'

import { useSessionStore, getSession } from '@entities/session'

interface TabItem {
  key: string
  icon: ReactNode
  label: string
}

const tabs: TabItem[] = [
  { key: '/search', icon: <SearchOutlined />, label: 'Поиск' },
  { key: '/cart', icon: <ProfileOutlined />, label: 'Заказ' },
]

export function BottomTabBar() {
  const navigate = useNavigate()
  const location = useLocation()
  const sessionId = useSessionStore((s) => s.sessionId)

  const { data: itemCount = 0 } = useQuery({
    queryKey: ['session', sessionId],
    queryFn: () => getSession(sessionId!),
    enabled: !!sessionId,
    select: (data) => data.session.items.length,
  })

  const activePath = location.pathname

  return (
    <div className="bottom-tab-bar">
      {tabs.map((tab) => {
        const isActive = activePath === tab.key || activePath.startsWith(tab.key + '/')
        return (
          <button
            key={tab.key}
            className={`bottom-tab-bar__tab ${isActive ? 'bottom-tab-bar__tab--active' : ''}`}
            onClick={() => navigate(tab.key)}
          >
            <span className="bottom-tab-bar__icon">
              {tab.key === '/cart' ? (
                <Badge count={itemCount} size="small" offset={[4, -2]}>
                  {tab.icon}
                </Badge>
              ) : (
                tab.icon
              )}
            </span>
            <span className="bottom-tab-bar__label">{tab.label}</span>
          </button>
        )
      })}
    </div>
  )
}
