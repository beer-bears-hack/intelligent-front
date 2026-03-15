import { EditOutlined } from '@ant-design/icons'
import { Button, Card, Empty, List, Space, Typography } from 'antd'

import { DeleteItemButton } from '@features/manage-cart-item'

import type { SessionItem } from '@shared/contracts'
import { formatPrice } from '@shared/lib/format'

interface CartCardListProps {
  items: SessionItem[]
  onEdit: (item: SessionItem) => void
  onDelete: (itemId: string) => void
  deletingId: string | null
}

export function CartCardList({ items, onEdit, onDelete, deletingId }: CartCardListProps) {
  if (items.length === 0) {
    return <Empty description="Корзина пуста" />
  }

  return (
    <List
      dataSource={items}
      renderItem={(item) => (
        <Card size="small" style={{ marginBottom: 8 }}>
          <Typography.Paragraph ellipsis={{ rows: 2 }} style={{ marginBottom: 4, fontWeight: 600 }}>
            {item.name}
          </Typography.Paragraph>
          <Typography.Text>
            {item.quantity} × {formatPrice(item.unitPrice)} = <b>{formatPrice(item.totalPrice)}</b>
          </Typography.Text>
          <div style={{ marginTop: 8 }}>
            <Space>
              <Button icon={<EditOutlined />} size="small" onClick={() => onEdit(item)}>
                Изменить
              </Button>
              <DeleteItemButton
                onConfirm={() => onDelete(item.name)}
                loading={deletingId === item.name}
              />
            </Space>
          </div>
        </Card>
      )}
    />
  )
}
