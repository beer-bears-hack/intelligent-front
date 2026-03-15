import { Button, Empty, Skeleton, Table, Tag } from 'antd'
import type { ColumnsType } from 'antd/es/table'
import { useNavigate } from 'react-router'

import type { SearchResult } from '@shared/contracts'
import { useIsMobile } from '@shared/lib/use-is-mobile'
import { EllipsisWithTooltip } from '@shared/ui/ellipsis-with-tooltip'

import { SearchResultsCardList } from './search-results-card-list'

interface SearchResultsTableProps {
  data: SearchResult[]
  loading: boolean
}

function getScoreColor(score: number): string {
  if (score > 0.8) return 'green'
  if (score > 0.5) return 'orange'
  return 'red'
}

function formatScore(score: number): string {
  return Number.isNaN(score) ? '—' : `${(score * 100).toFixed(1)}%`
}

export function SearchResultsTable({ data, loading }: SearchResultsTableProps) {
  const navigate = useNavigate()
  const isMobile = useIsMobile()

  if (isMobile) {
    return <SearchResultsCardList data={data} loading={loading} />
  }

  const columns: ColumnsType<SearchResult> = [
    {
      title: 'Наименование',
      dataIndex: 'name',
      key: 'name',
      minWidth: 300,
      render: (text: string) => <EllipsisWithTooltip text={text} maxWidth={500} />,
    },
    {
      title: 'Категория',
      dataIndex: 'category',
      key: 'category',
      minWidth: 200,
      render: (text: string) => <EllipsisWithTooltip text={text} maxWidth={300} />,
    },
    {
      title: 'Релевантность',
      dataIndex: 'similarityScore',
      key: 'similarityScore',
      minWidth: 130,
      align: 'center',
      sorter: (a, b) => a.similarityScore - b.similarityScore,
      defaultSortOrder: 'descend',
      render: (score: number) => (
        <Tag variant="outlined" color={getScoreColor(score)}>
          {formatScore(score)}
        </Tag>
      ),
    },
    {
      title: 'Действие',
      key: 'action',
      minWidth: 130,
      align: 'center',
      render: (_, record) => (
        <Button
          type="link"
          onClick={(e) => {
            e.stopPropagation()
            void navigate(`/price-analysis/${record.cteId}`)
          }}
        >
          Анализ цен
        </Button>
      ),
    },
  ]

  if (loading && data.length === 0) {
    const skeletonColumns = columns.map((col) => ({
      ...col,
      render: () => <Skeleton.Input active size="small" block />,
      sorter: undefined,
      defaultSortOrder: undefined,
    }))
    return <Table columns={skeletonColumns} rowKey="key" pagination={false} />
  }

  return (
    <Table<SearchResult>
      columns={columns}
      dataSource={data}
      rowKey="cteId"
      locale={{ emptyText: <Empty description="Нет результатов" /> }}
      pagination={{ pageSize: 10, showSizeChanger: false }}
      scroll={{ x: 'max-content' }}
      rowClassName={() => 'ant-table-row-clickable'}
      onRow={(record) => ({
        onClick: () => void navigate(`/price-analysis/${record.cteId}`),
      })}
    />
  )
}
