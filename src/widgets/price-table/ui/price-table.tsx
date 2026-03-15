import { Checkbox, Table, Tag, Tooltip } from 'antd'
import type { ColumnsType } from 'antd/es/table'
import dayjs from 'dayjs'
import { useMemo } from 'react'

import type { Price, ManualPrice } from '@/shared/contracts'

import { formatPrice } from '@shared/lib/format'
import { useIsMobile } from '@shared/lib/use-is-mobile'
import { EllipsisWithTooltip } from '@shared/ui/ellipsis-with-tooltip'

import { PriceCardList } from './price-card-list'

interface TableRow {
  key: number
  price: number
  date: string | null
  source: string
  isOutlier: boolean
  reason?: string
  isManual: boolean
  manualIndex?: number
}

interface PriceTableProps {
  prices: Price[]
  manualPrices: ManualPrice[]
  selectedIds: Set<number>
  onToggle: (id: number) => void
  manualSelectedIndices: Set<number>
  onToggleManual: (idx: number) => void
  loading: boolean
}

export function PriceTable({
  prices,
  manualPrices,
  selectedIds,
  onToggle,
  manualSelectedIndices,
  onToggleManual,
  loading,
}: PriceTableProps) {
  const isMobile = useIsMobile()

  const dataSource = useMemo<TableRow[]>(() => {
    const apiRows: TableRow[] = prices.map((p) => ({
      key: p.contractId,
      price: p.price,
      date: p.date,
      source: p.source,
      isOutlier: p.isOutlier ?? false,
      reason: p.reason ?? undefined,
      isManual: false,
    }))

    const manualRows: TableRow[] = manualPrices.map((mp, idx) => ({
      key: -(idx + 1),
      price: mp.price,
      date: null,
      source: mp.reason,
      isOutlier: false,
      isManual: true,
      manualIndex: idx,
    }))

    return [...apiRows, ...manualRows]
  }, [prices, manualPrices])

  if (isMobile) {
    return (
      <PriceCardList
        prices={prices}
        manualPrices={manualPrices}
        selectedIds={selectedIds}
        onToggle={onToggle}
        manualSelectedIndices={manualSelectedIndices}
        onToggleManual={onToggleManual}
        loading={loading}
      />
    )
  }

  const columns: ColumnsType<TableRow> = [
    {
      title: '',
      dataIndex: 'key',
      width: 48,
      render: (_: unknown, record: TableRow) => {
        if (record.isManual) {
          return (
            <Checkbox
              checked={manualSelectedIndices.has(record.manualIndex!)}
              onChange={() => onToggleManual(record.manualIndex!)}
            />
          )
        }
        return (
          <Checkbox checked={selectedIds.has(record.key)} onChange={() => onToggle(record.key)} />
        )
      },
    },
    {
      title: 'Цена',
      dataIndex: 'price',
      minWidth: 140,
      sorter: (a: TableRow, b: TableRow) => a.price - b.price,
      render: (value: number) => formatPrice(value),
    },
    {
      title: 'Дата',
      dataIndex: 'date',
      minWidth: 130,
      sorter: (a: TableRow, b: TableRow) => {
        if (!a.date) return 1
        if (!b.date) return -1
        return dayjs(a.date).unix() - dayjs(b.date).unix()
      },
      render: (value: string | null) => (value ? dayjs(value).format('DD.MM.YYYY') : '—'),
    },
    {
      title: 'Источник',
      dataIndex: 'source',
      minWidth: 200,
      render: (text: string) => <EllipsisWithTooltip text={text} maxWidth={350} />,
    },
    {
      title: 'Статус',
      dataIndex: 'isOutlier',
      minWidth: 120,
      render: (_: unknown, record: TableRow) => {
        if (record.isManual) {
          return (
            <Tag variant="outlined" color="blue">
              Ручная
            </Tag>
          )
        }
        if (record.isOutlier) {
          return (
            <Tooltip title={record.reason}>
              <Tag variant="outlined" color="red">
                Выброс
              </Tag>
            </Tooltip>
          )
        }
        return null
      },
    },
  ]

  return (
    <Table<TableRow>
      columns={columns}
      dataSource={dataSource}
      loading={loading}
      pagination={false}
      size="small"
      rowClassName={(record) => (record.isOutlier && !record.isManual ? 'price-row-outlier' : '')}
      style={{ marginTop: 16 }}
      scroll={{ x: 'max-content' }}
    />
  )
}
