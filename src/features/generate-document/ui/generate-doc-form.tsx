import { FileTextOutlined } from '@ant-design/icons'
import { Button, Card, Checkbox, Form, Input } from 'antd'

import type { DocumentSettings } from '@entities/document'

import { FormItemWithTooltip } from '@/shared/ui/form-item-with-tooltip'

interface GenerateDocFormProps {
  onGenerate: (settings: DocumentSettings) => void
  loading: boolean
}

export function GenerateDocForm({ onGenerate, loading }: GenerateDocFormProps) {
  const [form] = Form.useForm<DocumentSettings>()

  const handleFinish = (values: DocumentSettings) => {
    onGenerate(values)
  }

  return (
    <Card title="Настройки документа">
      <Form
        form={form}
        layout="vertical"
        onFinish={handleFinish}
        initialValues={{ include_cover_page: true, signer_name: '' }}
        autoComplete="off"
      >
        <FormItemWithTooltip
          label="ФИО подписанта"
          name="signer_name"
          rules={[{ required: true, message: 'Введите ФИО подписанта' }]}
        >
          <Input placeholder="Иванов И.И." autoComplete="off" />
        </FormItemWithTooltip>

        <Form.Item name="include_cover_page" valuePropName="checked">
          <Checkbox>Включить титульную страницу</Checkbox>
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit" icon={<FileTextOutlined />} loading={loading}>
            Сформировать документ
          </Button>
        </Form.Item>
      </Form>
    </Card>
  )
}
