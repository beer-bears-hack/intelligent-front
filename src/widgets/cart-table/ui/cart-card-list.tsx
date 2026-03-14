import { EditOutlined } from '@ant-design/icons'
import { Button, Card, Empty, List, Space, Typography } from 'antd'

import { DeleteItemButton } from '@features/manage-cart-item'

import type { CartItem } from '@entities/session'

import { formatPrice } from '@shared/lib/format'

interface CartCardListProps {
  items: CartItem[]
  onEdit: (item: CartItem) => void
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
            {item.quantity} × {formatPrice(item.unit_price)} ={' '}
            <b>{formatPrice(item.total_price)}</b>
          </Typography.Text>
          <div style={{ marginTop: 8 }}>
            <Space>
              <Button icon={<EditOutlined />} size="small" onClick={() => onEdit(item)}>
                Изменить
              </Button>
              <DeleteItemButton
                onConfirm={() => onDelete(item.item_id)}
                loading={deletingId === item.item_id}
              />
            </Space>
          </div>
        </Card>
      )}
    />
  )
}
