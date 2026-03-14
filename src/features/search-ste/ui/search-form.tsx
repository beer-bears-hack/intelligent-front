import { SearchOutlined } from '@ant-design/icons'
import { Form, Input } from 'antd'

import type { SearchRequest } from '@entities/ste'

import { Button } from '@/shared/ui/button'
import { FormItemWithTooltip } from '@/shared/ui/form-item-with-tooltip'

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
      autoComplete="off"
    >
      <FormItemWithTooltip
        name="query"
        rules={[{ required: true, message: 'Введите поисковый запрос' }]}
        style={{ flex: 1, minWidth: 280 }}
      >
        <Input placeholder="Введите название товара или услуги" allowClear autoComplete="off" />
      </FormItemWithTooltip>

      <Form.Item name="region_code">
        <Input
          placeholder="Код региона (необязательно)"
          style={{ width: 220 }}
          allowClear
          autoComplete="off"
        />
      </Form.Item>

      <Form.Item>
        <Button type="primary" htmlType="submit" icon={<SearchOutlined />} loading={loading}>
          Найти
        </Button>
      </Form.Item>
    </Form>
  )
}
