import { Typography } from 'antd'
import type { ReactNode } from 'react'

interface PageContainerProps {
  title: string
  children?: ReactNode
}

export function PageContainer({ title, children }: PageContainerProps) {
  return (
    <div style={{ padding: 24 }}>
      <Typography.Title level={2}>{title}</Typography.Title>
      {children}
    </div>
  )
}
