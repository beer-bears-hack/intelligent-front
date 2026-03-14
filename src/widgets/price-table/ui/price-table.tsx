import { Checkbox, Table, Tag, Tooltip } from 'antd'
import type { ColumnsType } from 'antd/es/table'
import dayjs from 'dayjs'
import { useMemo } from 'react'

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

interface PriceTableProps {
  prices: PriceEntry[]
  manualPrices: ManualPrice[]
  selectedIds: Set<number>
  onToggle: (id: number) => void
  loading: boolean
}

export function PriceTable({
  prices,
  manualPrices,
  selectedIds,
  onToggle,
  loading,
}: PriceTableProps) {
  const dataSource = useMemo<TableRow[]>(() => {
    const apiRows: TableRow[] = prices.map((p) => ({
      key: p.id,
      price: p.price,
      date: p.date,
      source: p.source,
      is_outlier: p.is_outlier,
      reason: p.reason,
      isManual: false,
    }))

    const manualRows: TableRow[] = manualPrices.map((mp, idx) => ({
      key: -(idx + 1),
      price: mp.price,
      date: null,
      source: mp.source,
      is_outlier: false,
      isManual: true,
    }))

    return [...apiRows, ...manualRows]
  }, [prices, manualPrices])

  const columns: ColumnsType<TableRow> = [
    {
      title: '',
      dataIndex: 'key',
      width: 48,
      render: (_: unknown, record: TableRow) => {
        if (record.isManual) {
          return <Checkbox checked disabled />
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
      ellipsis: true,
      minWidth: 200,
    },
    {
      title: 'Статус',
      dataIndex: 'is_outlier',
      minWidth: 120,
      render: (_: unknown, record: TableRow) => {
        if (record.isManual) {
          return (
            <Tag variant="outlined" color="blue">
              Ручная
            </Tag>
          )
        }
        if (record.is_outlier) {
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
      rowClassName={(record) => (record.is_outlier && !record.isManual ? 'price-row-outlier' : '')}
      style={{ marginTop: 16 }}
      scroll={{ x: 'max-content' }}
    />
  )
}
