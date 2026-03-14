import { Card, Checkbox, Empty, List, Spin, Tag, Tooltip, Typography } from 'antd'
import dayjs from 'dayjs'

import type { PriceEntry, ManualPrice } from '@entities/price'

import { formatPrice } from '@shared/lib/format'

interface TableRow {
  key: number
  price: number
  date: string | null
  source: string
  is_outlier: boolean
  reason?: string
  isManual: boolean
}

interface PriceCardListProps {
  prices: PriceEntry[]
  manualPrices: ManualPrice[]
  selectedIds: Set<number>
  onToggle: (id: number) => void
  loading: boolean
}

export function PriceCardList({
  prices,
  manualPrices,
  selectedIds,
  onToggle,
  loading,
}: PriceCardListProps) {
  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: 48 }}>
        <Spin />
      </div>
    )
  }

  const rows: TableRow[] = [
    ...prices.map((p) => ({
      key: p.id,
      price: p.price,
      date: p.date,
      source: p.source,
      is_outlier: p.is_outlier,
      reason: p.reason,
      isManual: false,
    })),
    ...manualPrices.map((mp, idx) => ({
      key: -(idx + 1),
      price: mp.price,
      date: null,
      source: mp.source,
      is_outlier: false,
      isManual: true,
    })),
  ]

  if (rows.length === 0) {
    return <Empty description="Нет ценовых данных" />
  }

  return (
    <List
      dataSource={rows}
      style={{ marginTop: 16 }}
      renderItem={(row) => (
        <Card
          size="small"
          style={{
            marginBottom: 8,
            borderLeft: row.is_outlier && !row.isManual ? '3px solid #DB2B21' : undefined,
          }}
        >
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12 }}>
            <Checkbox
              checked={row.isManual ? true : selectedIds.has(row.key)}
              disabled={row.isManual}
              onChange={() => !row.isManual && onToggle(row.key)}
              style={{ marginTop: 2 }}
            />
            <div style={{ flex: 1, minWidth: 0 }}>
              <Typography.Text strong style={{ fontSize: 16 }}>
                {formatPrice(row.price)}
              </Typography.Text>
              <div
                style={{
                  display: 'flex',
                  gap: 8,
                  alignItems: 'center',
                  marginTop: 4,
                  flexWrap: 'wrap',
                }}
              >
                <Typography.Text type="secondary" style={{ fontSize: 12 }}>
                  {row.date ? dayjs(row.date).format('DD.MM.YYYY') : '—'}
                </Typography.Text>
                <Typography.Text type="secondary" style={{ fontSize: 12 }} ellipsis>
                  {row.source}
                </Typography.Text>
                {row.isManual && (
                  <Tag variant="outlined" color="blue" style={{ marginInlineEnd: 0 }}>
                    Ручная
                  </Tag>
                )}
                {row.is_outlier && !row.isManual && (
                  <Tooltip title={row.reason}>
                    <Tag variant="outlined" color="red" style={{ marginInlineEnd: 0 }}>
                      Выброс
                    </Tag>
                  </Tooltip>
                )}
              </div>
            </div>
          </div>
        </Card>
      )}
    />
  )
}
