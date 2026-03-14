import { Button, Empty, Table, Tag } from 'antd'
import type { ColumnsType } from 'antd/es/table'
import { useNavigate } from 'react-router'

import type { SteItem } from '@entities/ste'

interface SearchResultsTableProps {
  data: SteItem[]
  loading: boolean
}

function getScoreColor(score: number): string {
  if (score > 0.8) return 'green'
  if (score > 0.5) return 'orange'
  return 'red'
}

export function SearchResultsTable({ data, loading }: SearchResultsTableProps) {
  const navigate = useNavigate()

  const columns: ColumnsType<SteItem> = [
    {
      title: 'Наименование',
      dataIndex: 'name',
      key: 'name',
      ellipsis: true,
      minWidth: 300,
    },
    {
      title: 'Категория',
      dataIndex: 'category',
      key: 'category',
      minWidth: 200,
    },
    {
      title: 'Код КПГЗ',
      dataIndex: 'kpgz_code',
      key: 'kpgz_code',
      minWidth: 160,
    },
    {
      title: 'Релевантность',
      dataIndex: 'similarity_score',
      key: 'similarity_score',
      minWidth: 130,
      align: 'center',
      sorter: (a, b) => a.similarity_score - b.similarity_score,
      defaultSortOrder: 'descend',
      render: (score: number) => (
        <Tag variant="outlined" color={getScoreColor(score)}>
          {(score * 100).toFixed(1)}%
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
            void navigate(`/price-analysis/${record.ste_id}`)
          }}
        >
          Анализ цен
        </Button>
      ),
    },
  ]

  return (
    <Table<SteItem>
      columns={columns}
      dataSource={data}
      rowKey="ste_id"
      loading={loading}
      locale={{ emptyText: <Empty description="Нет результатов" /> }}
      pagination={{ pageSize: 10, showSizeChanger: true }}
      scroll={{ x: 'max-content' }}
      rowClassName={() => 'ant-table-row-clickable'}
      onRow={(record) => ({
        onClick: () => void navigate(`/price-analysis/${record.ste_id}`),
      })}
    />
  )
}
