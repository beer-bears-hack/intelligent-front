import { Grid, Typography } from 'antd'
import type { ReactNode } from 'react'

const { useBreakpoint } = Grid

interface PageContainerProps {
  title: string
  children?: ReactNode
}

function getContainerWidth(screens: ReturnType<typeof useBreakpoint>): string {
  if (screens.xxl) return '1600px'
  if (screens.xl) return '1280px'
  if (screens.lg) return '1024px'
  if (screens.md) return '720px'
  return '100%'
}

export function PageContainer({ title, children }: PageContainerProps) {
  const screens = useBreakpoint()
  const width = getContainerWidth(screens)

  return (
    <div style={{ maxWidth: width, width: '100%', margin: '0 auto', padding: 24 }}>
      <Typography.Title level={2}>{title}</Typography.Title>
      {children}
    </div>
  )
}
