import { Button, Card, Empty, List, Spin, Tag, Typography } from 'antd'
import { useNavigate } from 'react-router'

import type { SearchResult } from '@shared/contracts'

interface SearchResultsCardListProps {
  data: SearchResult[]
  loading: boolean
}

function getScoreColor(score: number): string {
  if (score > 0.8) return 'green'
  if (score > 0.5) return 'orange'
  return 'red'
}

export function SearchResultsCardList({ data, loading }: SearchResultsCardListProps) {
  const navigate = useNavigate()

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: 48 }}>
        <Spin />
      </div>
    )
  }

  if (data.length === 0) {
    return <Empty description="Нет результатов" />
  }

  return (
    <List
      dataSource={data}
      renderItem={(item) => (
        <Card
          size="small"
          style={{ marginBottom: 8, cursor: 'pointer' }}
          onClick={() => navigate(`/price-analysis/${item.cteId}`)}
        >
          <Typography.Paragraph ellipsis={{ rows: 2 }} style={{ marginBottom: 4, fontWeight: 600 }}>
            {item.name}
          </Typography.Paragraph>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography.Text type="secondary" style={{ fontSize: 12 }}>
              {item.category}
            </Typography.Text>
            <Tag variant="outlined" color={getScoreColor(item.similarityScore)}>
              {(item.similarityScore * 100).toFixed(1)}%
            </Tag>
          </div>
          <Button
            type="link"
            size="small"
            style={{ padding: 0, marginTop: 4 }}
            onClick={(e) => {
              e.stopPropagation()
              void navigate(`/price-analysis/${item.cteId}`)
            }}
          >
            Анализ цен →
          </Button>
        </Card>
      )}
    />
  )
}
