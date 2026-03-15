import { Modal, InputNumber, Form } from 'antd'
import { useState } from 'react'

import type { SessionItem } from '@shared/contracts'

interface EditItemModalProps {
  open: boolean
  item: SessionItem | null
  onClose: () => void
  onSave: (itemId: string, quantity: number) => void
  loading: boolean
}

export function EditItemModal({ open, item, onClose, onSave, loading }: EditItemModalProps) {
  const [quantity, setQuantity] = useState(item?.quantity ?? 1)

  const [prevItem, setPrevItem] = useState(item)
  if (item !== prevItem) {
    setPrevItem(item)
    if (item) {
      setQuantity(item.quantity)
    }
  }

  const handleOk = () => {
    if (item) {
      onSave(item.name, quantity)
    }
  }

  return (
    <Modal
      title="Редактирование позиции"
      open={open}
      onCancel={onClose}
      onOk={handleOk}
      confirmLoading={loading}
      okText="Сохранить"
      cancelText="Отмена"
      destroyOnHidden
    >
      <Form layout="vertical">
        <Form.Item label="Наименование">
          <span>{item?.name}</span>
        </Form.Item>
        <Form.Item label="Количество">
          <InputNumber
            min={1}
            value={quantity}
            onChange={(val) => setQuantity(val ?? 1)}
            style={{ width: '100%' }}
          />
        </Form.Item>
      </Form>
    </Modal>
  )
}
