import { InfoCircleOutlined, WarningOutlined } from '@ant-design/icons'
import { Checkbox, Table, Tooltip } from 'antd'
import type { ColumnsType } from 'antd/es/table'
import dayjs from 'dayjs'
import { useMemo } from 'react'

import type { Price, ManualPrice } from '@/shared/contracts'

import { formatPrice } from '@shared/lib/format'
import { useIsMobile } from '@shared/lib/use-is-mobile'
import { EllipsisWithTooltip } from '@shared/ui/ellipsis-with-tooltip'

import { PriceCardList } from './price-card-list'

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
  isSame: boolean
  manualIndex?: number
}

interface PriceTableProps {
  prices: PriceRow[]
  manualPrices: ManualPrice[]
  selectedIds: Set<string>
  onToggle: (id: string) => void
  onToggleAll: (checked: boolean) => void
  manualSelectedIndices: Set<number>
  onToggleManual: (idx: number) => void
  loading: boolean
  parentId?: string
}

export function PriceTable({
  prices,
  manualPrices,
  selectedIds,
  onToggle,
  onToggleAll,
  manualSelectedIndices,
  onToggleManual,
  loading,
  parentId,
}: PriceTableProps) {
  const isMobile = useIsMobile()

  const dataSource = useMemo<TableRow[]>(() => {
    const apiRows: TableRow[] = prices.map((p) => ({
      key: `${p.cteId}:${p.contractId}`,
      cteName: p.name,
      price: p.price,
      date: p.date,
      source: p.source,
      isOutlier: p.isOutlier ?? false,
      reason: p.reason ?? undefined,
      isManual: false,
      isSame: !!parentId && p.cteId === parentId,
    }))

    const manualRows: TableRow[] = manualPrices.map((mp, idx) => ({
      key: `manual:${idx}`,
      cteName: 'Ручной ввод',
      price: mp.price,
      date: null,
      source: mp.reason,
      isOutlier: false,
      isSame: false,
      isManual: true,
      manualIndex: idx,
    }))

    return [...apiRows, ...manualRows]
  }, [prices, manualPrices, parentId])

  const totalCount = prices.length + manualPrices.length
  const selectedCount = selectedIds.size + manualSelectedIndices.size
  const allChecked = totalCount > 0 && selectedCount === totalCount
  const someChecked = selectedCount > 0 && selectedCount < totalCount

  if (isMobile) {
    return (
      <PriceCardList
        prices={prices}
        manualPrices={manualPrices}
        selectedIds={selectedIds}
        onToggle={onToggle}
        onToggleAll={onToggleAll}
        allChecked={allChecked}
        someChecked={someChecked}
        manualSelectedIndices={manualSelectedIndices}
        onToggleManual={onToggleManual}
        loading={loading}
        parentId={parentId}
      />
    )
  }

  const columns: ColumnsType<TableRow> = [
    {
      title: (
        <Checkbox
          checked={allChecked}
          indeterminate={someChecked}
          onChange={(e) => onToggleAll(e.target.checked)}
        />
      ),
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
      title: 'Наименование',
      dataIndex: 'cteName',
      minWidth: 200,
      render: (_: unknown, record: TableRow) => (
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
          <EllipsisWithTooltip text={record.cteName} maxWidth={300} />
          {record.isOutlier && !record.isManual && (
            <Tooltip title={record.reason}>
              <WarningOutlined style={{ color: '#faad14', fontSize: 14 }} />
            </Tooltip>
          )}
          {record.isSame && !record.isOutlier && (
            <Tooltip title="Полностью соответствует выбранной СТЕ">
              <InfoCircleOutlined style={{ color: '#52c41a', fontSize: 14 }} />
            </Tooltip>
          )}
        </span>
      ),
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
  ]

  return (
    <Table<TableRow>
      columns={columns}
      dataSource={dataSource}
      loading={loading}
      pagination={false}
      size="small"
      rowClassName={(record) => {
        if (record.isOutlier && !record.isManual) return 'price-row-outlier'
        if (record.isManual) return 'price-row-manual'
        if (record.isSame) return 'price-row-same'
        return ''
      }}
      style={{ marginTop: 16 }}
      scroll={{ x: 'max-content' }}
    />
  )
}
