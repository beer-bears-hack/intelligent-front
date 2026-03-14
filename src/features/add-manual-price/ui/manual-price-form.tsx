import { Form, Input, InputNumber, Modal } from 'antd'

import type { ManualPrice } from '@entities/price'

interface ManualPriceFormProps {
  open: boolean
  onClose: () => void
  onAdd: (p: ManualPrice) => void
}

export function ManualPriceForm({ open, onClose, onAdd }: ManualPriceFormProps) {
  const [form] = Form.useForm<ManualPrice>()

  const handleOk = async () => {
    try {
      const values = await form.validateFields()
      onAdd(values)
      form.resetFields()
      onClose()
    } catch {
      // validation failed
    }
  }

  const handleCancel = () => {
    form.resetFields()
    onClose()
  }

  return (
    <Modal
      title="Добавить цену вручную"
      open={open}
      onOk={handleOk}
      onCancel={handleCancel}
      okText="Добавить"
      cancelText="Отмена"
      destroyOnClose
    >
      <Form form={form} layout="vertical" autoComplete="off">
        <Form.Item
          name="price"
          label="Цена"
          rules={[
            { required: true, message: 'Укажите цену' },
            { type: 'number', min: 0.01, message: 'Цена должна быть больше 0' },
          ]}
        >
          <InputNumber
            style={{ width: '100%' }}
            min={0.01}
            step={0.01}
            placeholder="0.00"
            addonAfter="₽"
          />
        </Form.Item>
        <Form.Item
          name="source"
          label="Источник"
          rules={[{ required: true, message: 'Укажите источник' }]}
        >
          <Input placeholder="Например: коммерческое предложение" />
        </Form.Item>
      </Form>
    </Modal>
  )
}
