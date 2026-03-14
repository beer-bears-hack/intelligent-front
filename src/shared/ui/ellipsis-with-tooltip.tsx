import { Tooltip } from 'antd'
import type { CSSProperties } from 'react'

interface EllipsisWithTooltipProps {
  text: string
  maxWidth?: number | string
  style?: CSSProperties
}

export function EllipsisWithTooltip({ text, maxWidth = 200, style }: EllipsisWithTooltipProps) {
  return (
    <Tooltip title={text}>
      <span
        title=""
        style={{
          display: 'inline-block',
          maxWidth,
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          whiteSpace: 'nowrap',
          verticalAlign: 'bottom',
          ...style,
        }}
      >
        {text}
      </span>
    </Tooltip>
  )
}
