import { ConfigProvider, Grid } from 'antd'
import ruRU from 'antd/locale/ru_RU'
import type { ReactNode } from 'react'

import { getPortalTheme } from '@shared/config/theme'

const { useBreakpoint } = Grid

function ThemedProvider({ children }: { children: ReactNode }) {
  const screens = useBreakpoint()
  const isMobile = !screens.md
  const theme = getPortalTheme(isMobile)

  return (
    <ConfigProvider locale={ruRU} theme={theme}>
      {children}
    </ConfigProvider>
  )
}

export const AntConfigProvider = ({ children }: { children: ReactNode }) => (
  <ConfigProvider>
    <ThemedProvider>{children}</ThemedProvider>
  </ConfigProvider>
)
