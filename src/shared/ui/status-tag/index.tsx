import { ExclamationCircleOutlined, InfoCircleOutlined } from '@ant-design/icons'
import { Tag } from 'antd'
import type { ReactNode } from 'react'

type StatusTagVariant = 'information' | 'error'

interface StatusTagProps {
  variant: StatusTagVariant
  children: ReactNode
}

const variantConfig: Record<StatusTagVariant, { bg: string; color: string; icon: ReactNode }> = {
  information: {
    bg: '#E7EEF7',
    color: '#264B82',
    icon: <InfoCircleOutlined />,
  },
  error: {
    bg: '#FFEBEB',
    color: '#DB2B21',
    icon: <ExclamationCircleOutlined />,
  },
}

export function StatusTag({ variant, children }: StatusTagProps) {
  const config = variantConfig[variant]

  return (
    <Tag
      icon={config.icon}
      style={{ backgroundColor: config.bg, color: config.color, border: 'none' }}
    >
      {children}
    </Tag>
  )
}
