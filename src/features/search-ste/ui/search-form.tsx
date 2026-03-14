import { SearchOutlined } from '@ant-design/icons'
import { Button, Form, Input } from 'antd'

import type { SearchRequest } from '@entities/ste'

interface SearchFormProps {
  onSearch: (values: SearchRequest) => void
  loading: boolean
}

export function SearchForm({ onSearch, loading }: SearchFormProps) {
  const [form] = Form.useForm<SearchRequest>()

  const handleFinish = (values: SearchRequest) => {
    const params: SearchRequest = {
      query: values.query,
      ...(values.region_code ? { region_code: values.region_code } : {}),
    }
    onSearch(params)
  }

  return (
    <Form
      form={form}
      layout="inline"
      onFinish={handleFinish}
      style={{ marginBottom: 24, flexWrap: 'wrap', gap: 8 }}
    >
      <Form.Item
        name="query"
        rules={[{ required: true, message: 'Введите поисковый запрос' }]}
        style={{ flex: 1, minWidth: 280 }}
      >
        <Input placeholder="Введите название товара или услуги" allowClear />
      </Form.Item>

      <Form.Item name="region_code">
        <Input placeholder="Код региона (необязательно)" style={{ width: 220 }} allowClear />
      </Form.Item>

      <Form.Item>
        <Button type="primary" htmlType="submit" icon={<SearchOutlined />} loading={loading}>
          Найти
        </Button>
      </Form.Item>
    </Form>
  )
}
