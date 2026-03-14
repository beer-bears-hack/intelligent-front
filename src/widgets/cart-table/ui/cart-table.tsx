import { EditOutlined } from '@ant-design/icons'
import { Table, Button, Space } from 'antd'
import type { ColumnsType } from 'antd/es/table'

import { DeleteItemButton } from '@features/manage-cart-item'

import type { CartItem } from '@entities/session'

import { formatPrice } from '@shared/lib/format'

interface CartTableProps {
  items: CartItem[]
  onEdit: (item: CartItem) => void
  onDelete: (itemId: string) => void
  deletingId: string | null
}

export function CartTable({ items, onEdit, onDelete, deletingId }: CartTableProps) {
  const columns: ColumnsType<CartItem> = [
    {
      title: 'Наименование',
      dataIndex: 'name',
      key: 'name',
      minWidth: 250,
    },
    {
      title: 'Количество',
      dataIndex: 'quantity',
      key: 'quantity',
      minWidth: 120,
    },
    {
      title: 'Цена за ед.',
      dataIndex: 'unit_price',
      key: 'unit_price',
      minWidth: 160,
      render: (value: number) => formatPrice(value),
    },
    {
      title: 'Итого',
      dataIndex: 'total_price',
      key: 'total_price',
      minWidth: 160,
      render: (value: number) => formatPrice(value),
    },
    {
      title: 'Действия',
      key: 'actions',
      minWidth: 100,
      render: (_, record) => (
        <Space>
          <Button icon={<EditOutlined />} size="small" onClick={() => onEdit(record)} />
          <DeleteItemButton
            onConfirm={() => onDelete(record.item_id)}
            loading={deletingId === record.item_id}
          />
        </Space>
      ),
    },
  ]

  return (
    <Table<CartItem>
      columns={columns}
      dataSource={items}
      rowKey="item_id"
      pagination={false}
      locale={{ emptyText: 'Корзина пуста' }}
      scroll={{ x: 'max-content' }}
    />
  )
}
