import { EditOutlined } from '@ant-design/icons'
import { Table, Button, Space } from 'antd'
import type { ColumnsType } from 'antd/es/table'

import { DeleteItemButton } from '@features/manage-cart-item'

import type { SessionItem } from '@shared/contracts'
import { formatPrice } from '@shared/lib/format'
import { useIsMobile } from '@shared/lib/use-is-mobile'
import { EllipsisWithTooltip } from '@shared/ui/ellipsis-with-tooltip'

import { CartCardList } from './cart-card-list'

interface CartTableProps {
  items: SessionItem[]
  onEdit: (item: SessionItem) => void
  onDelete: (itemId: string) => void
  deletingId: string | null
}

export function CartTable({ items, onEdit, onDelete, deletingId }: CartTableProps) {
  const isMobile = useIsMobile()

  if (isMobile) {
    return (
      <CartCardList items={items} onEdit={onEdit} onDelete={onDelete} deletingId={deletingId} />
    )
  }

  const columns: ColumnsType<SessionItem> = [
    {
      title: 'Наименование',
      dataIndex: 'name',
      key: 'name',
      minWidth: 250,
      render: (text: string) => <EllipsisWithTooltip text={text} maxWidth={450} />,
    },
    {
      title: 'Количество',
      dataIndex: 'quantity',
      key: 'quantity',
      minWidth: 120,
    },
    {
      title: 'Цена за ед.',
      dataIndex: 'unitPrice',
      key: 'unitPrice',
      minWidth: 160,
      render: (value: number) => formatPrice(value),
    },
    {
      title: 'Итого',
      dataIndex: 'totalPrice',
      key: 'totalPrice',
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
            onConfirm={() => onDelete(record.name)}
            loading={deletingId === record.name}
          />
        </Space>
      ),
    },
  ]

  return (
    <Table<SessionItem>
      columns={columns}
      dataSource={items}
      rowKey="name"
      pagination={false}
      locale={{ emptyText: 'Корзина пуста' }}
      scroll={{ x: 'max-content' }}
    />
  )
}
