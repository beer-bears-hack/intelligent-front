import { DeleteOutlined } from '@ant-design/icons'
import { Button, Popconfirm } from 'antd'

interface DeleteItemButtonProps {
  onConfirm: () => void
  loading: boolean
}

export function DeleteItemButton({ onConfirm, loading }: DeleteItemButtonProps) {
  return (
    <Popconfirm
      title="Удалить позицию из корзины?"
      onConfirm={onConfirm}
      okText="Удалить"
      cancelText="Отмена"
    >
      <Button danger icon={<DeleteOutlined />} loading={loading} size="small" />
    </Popconfirm>
  )
}
