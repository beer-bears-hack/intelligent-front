import { Card } from 'antd'
import dayjs from 'dayjs'
import {
  ResponsiveContainer,
  ScatterChart,
  Scatter,
  XAxis,
  YAxis,
  Tooltip as RechartsTooltip,
  CartesianGrid,
} from 'recharts'

import type { Price } from '@/shared/contracts'
import type { ManualPrice } from '@/shared/contracts'

import { formatPrice } from '@shared/lib/format'

interface PriceChartProps {
  prices: Price[]
  manualPrices: ManualPrice[]
}

interface ChartDot {
  x: number
  y: number
  date: string
  source: string
  label: string
}

function CustomTooltip({
  active,
  payload,
}: {
  active?: boolean
  payload?: { payload: ChartDot }[]
}) {
  if (!active || !payload?.length) return null
  const dot = payload[0].payload
  return (
    <div
      style={{ background: '#fff', border: '1px solid #d4dbe6', padding: '8px 12px', fontSize: 13 }}
    >
      <div>
        <b>{formatPrice(dot.y)}</b>
      </div>
      <div>{dot.date}</div>
      <div style={{ color: '#8c8c8c' }}>{dot.source}</div>
    </div>
  )
}

export function PriceChart({ prices, manualPrices }: PriceChartProps) {
  if (prices.length === 0 && manualPrices.length === 0) return null

  const normalDots: ChartDot[] = []
  const outlierDots: ChartDot[] = []

  for (const p of prices) {
    const dot: ChartDot = {
      x: dayjs(p.date).valueOf(),
      y: p.price,
      date: dayjs(p.date).format('DD.MM.YYYY'),
      source: p.source,
      label: p.isOutlier ? 'Выброс' : 'Цена',
    }
    if (p.isOutlier) {
      outlierDots.push(dot)
    } else {
      normalDots.push(dot)
    }
  }

  const todayTs = dayjs().valueOf()
  const manualDots: ChartDot[] = manualPrices.map((mp) => ({
    x: todayTs,
    y: mp.price,
    date: dayjs().format('DD.MM.YYYY'),
    source: mp.reason,
    label: 'Ручная',
  }))

  return (
    <Card title="Распределение цен" size="small" style={{ marginTop: 16 }}>
      <ResponsiveContainer width="100%" height={260}>
        <ScatterChart margin={{ top: 8, right: 8, bottom: 0, left: 0 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis
            dataKey="x"
            type="number"
            domain={['dataMin', 'dataMax']}
            tickFormatter={(ts: number) => dayjs(ts).format('DD.MM.YY')}
            fontSize={12}
          />
          <YAxis
            dataKey="y"
            type="number"
            tickFormatter={(v: number) => formatPrice(v)}
            fontSize={12}
            width={90}
          />
          <RechartsTooltip content={<CustomTooltip />} />
          {normalDots.length > 0 && <Scatter name="Цены" data={normalDots} fill="#264B82" />}
          {outlierDots.length > 0 && <Scatter name="Выбросы" data={outlierDots} fill="#DB2B21" />}
          {manualDots.length > 0 && <Scatter name="Ручные" data={manualDots} fill="#0D9B68" />}
        </ScatterChart>
      </ResponsiveContainer>
    </Card>
  )
}
