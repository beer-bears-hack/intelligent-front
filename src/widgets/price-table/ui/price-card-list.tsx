import { WarningOutlined } from '@ant-design/icons'
import { Card, Checkbox, Empty, List, Skeleton, Tooltip, Typography } from 'antd'
import dayjs from 'dayjs'

import type { Price, ManualPrice } from '@shared/contracts'
import { formatPrice } from '@shared/lib/format'

interface PriceRow extends Price {
  cteId: string
  name: string
  similarityScore: number
}

interface TableRow {
  key: string
  cteName: string
  price: number
  date: string | null
  source: string
  isOutlier: boolean
  reason?: string
  isManual: boolean
  manualIndex?: number
}

interface PriceCardListProps {
  prices: PriceRow[]
  manualPrices: ManualPrice[]
  selectedIds: Set<string>
  onToggle: (id: string) => void
  onToggleAll: (checked: boolean) => void
  allChecked: boolean
  someChecked: boolean
  manualSelectedIndices: Set<number>
  onToggleManual: (idx: number) => void
  loading: boolean
}

export function PriceCardList({
  prices,
  manualPrices,
  selectedIds,
  onToggle,
  onToggleAll,
  allChecked,
  someChecked,
  manualSelectedIndices,
  onToggleManual,
  loading,
}: PriceCardListProps) {
  if (loading) {
    return <Skeleton active paragraph={{ rows: 4 }} />
  }

  const rows: TableRow[] = [
    ...prices.map((p) => ({
      key: `${p.cteId}:${p.contractId}`,
      cteName: p.name,
      price: p.price,
      date: p.date,
      source: p.source,
      isOutlier: p.isOutlier ?? false,
      reason: p.reason ?? undefined,
      isManual: false,
    })),
    ...manualPrices.map((mp, idx) => ({
      key: `manual:${idx}`,
      cteName: 'Ручной ввод',
      price: mp.price,
      date: null,
      source: mp.reason,
      isOutlier: false,
      isManual: true,
      manualIndex: idx,
    })),
  ]

  if (rows.length === 0) {
    return <Empty description="Нет ценовых данных" style={{ margin: '24px 0' }} />
  }

  return (
    <>
      <div
        style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 16, marginBottom: 8 }}
      >
        <Checkbox
          checked={allChecked}
          indeterminate={someChecked}
          onChange={(e) => onToggleAll(e.target.checked)}
        />
        <Typography.Text type="secondary">Выбрать все</Typography.Text>
      </div>
      <List
        dataSource={rows}
        renderItem={(row) => (
          <Card
            size="small"
            style={{
              marginBottom: 8,
              borderLeft:
                row.isOutlier && !row.isManual
                  ? '3px solid #DB2B21'
                  : row.isManual
                    ? '3px solid #1677ff'
                    : undefined,
            }}
          >
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12 }}>
              <Checkbox
                checked={
                  row.isManual
                    ? manualSelectedIndices.has(row.manualIndex!)
                    : selectedIds.has(row.key)
                }
                onChange={() =>
                  row.isManual ? onToggleManual(row.manualIndex!) : onToggle(row.key)
                }
                style={{ marginTop: 2 }}
              />
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 4 }}>
                  <Typography.Text strong ellipsis style={{ flex: 1, minWidth: 0 }}>
                    {row.cteName}
                  </Typography.Text>
                  {row.isOutlier && !row.isManual && (
                    <Tooltip title={row.reason}>
                      <WarningOutlined style={{ color: '#faad14', fontSize: 14, flexShrink: 0 }} />
                    </Tooltip>
                  )}
                </div>
                <Typography.Text strong style={{ fontSize: 16 }}>
                  {formatPrice(row.price)}
                </Typography.Text>
                <Typography.Text
                  type="secondary"
                  style={{ fontSize: 13, marginTop: 4, display: 'block' }}
                  ellipsis
                >
                  {row.source}
                </Typography.Text>
                <Typography.Text
                  type="secondary"
                  style={{ fontSize: 11, marginTop: 2, display: 'block' }}
                >
                  {row.date ? dayjs(row.date).format('DD.MM.YYYY') : '—'}
                </Typography.Text>
              </div>
            </div>
          </Card>
        )}
      />
    </>
  )
}
