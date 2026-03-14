import { QuestionCircleOutlined } from '@ant-design/icons'
import { Grid, Tooltip, Typography } from 'antd'
import type { ReactNode } from 'react'

const { useBreakpoint } = Grid

interface PageContainerProps {
  title: string
  tooltip?: string
  children?: ReactNode
}

function getContainerWidth(screens: ReturnType<typeof useBreakpoint>): string {
  if (screens.xxl) return '1600px'
  if (screens.xl) return '1280px'
  if (screens.lg) return '1024px'
  if (screens.md) return '720px'
  return '100%'
}

export function PageContainer({ title, tooltip, children }: PageContainerProps) {
  const screens = useBreakpoint()
  const width = getContainerWidth(screens)

  return (
    <div style={{ maxWidth: width, width: '100%', margin: '0 auto', padding: 24 }}>
      <Typography.Title level={2}>
        {tooltip
          ? (() => {
              const lastSpace = title.lastIndexOf(' ')
              if (lastSpace === -1) {
                return (
                  <span style={{ whiteSpace: 'nowrap' }}>
                    {title}{' '}
                    <Tooltip title={tooltip}>
                      <QuestionCircleOutlined
                        style={{ color: '#8c8c8c', fontSize: 16, verticalAlign: 'middle' }}
                      />
                    </Tooltip>
                  </span>
                )
              }
              const before = title.slice(0, lastSpace)
              const lastWord = title.slice(lastSpace + 1)
              return (
                <>
                  {before}{' '}
                  <span style={{ whiteSpace: 'nowrap' }}>
                    {lastWord}{' '}
                    <Tooltip title={tooltip}>
                      <QuestionCircleOutlined
                        style={{ color: '#8c8c8c', fontSize: 16, verticalAlign: 'middle' }}
                      />
                    </Tooltip>
                  </span>
                </>
              )
            })()
          : title}
      </Typography.Title>
      {children}
    </div>
  )
}
