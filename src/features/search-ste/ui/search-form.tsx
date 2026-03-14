import { SearchOutlined } from '@ant-design/icons'
import { useQuery } from '@tanstack/react-query'
import { Col, Form, Input, Row, Select } from 'antd'
import { useState } from 'react'

import type { SearchRequest } from '@entities/ste'
import { getCategories, getManufacturers } from '@entities/ste'

import { Button } from '@/shared/ui/button'
import { FormItemWithTooltip } from '@/shared/ui/form-item-with-tooltip'

interface SearchFormProps {
  onSearch: (values: SearchRequest) => void
  loading: boolean
}

export function SearchForm({ onSearch, loading }: SearchFormProps) {
  const [form] = Form.useForm<SearchRequest>()
  const [categoriesOpen, setCategoriesOpen] = useState(false)
  const [manufacturersOpen, setManufacturersOpen] = useState(false)

  const categoriesQuery = useQuery({
    queryKey: ['categories'],
    queryFn: getCategories,
    enabled: false,
  })

  const manufacturersQuery = useQuery({
    queryKey: ['manufacturers'],
    queryFn: getManufacturers,
    enabled: false,
  })

  const handleFinish = (values: SearchRequest) => {
    const params: SearchRequest = {
      query: values.query.trim(),
      ...(values.category ? { category: values.category } : {}),
      ...(values.manufacturer ? { manufacturer: values.manufacturer } : {}),
      ...(values.region_code ? { region_code: values.region_code } : {}),
    }
    onSearch(params)
  }

  return (
    <Form
      form={form}
      layout="vertical"
      onFinish={handleFinish}
      style={{ marginBottom: 24 }}
      autoComplete="off"
    >
      <Row gutter={12} align="bottom">
        <Col flex="auto">
          <FormItemWithTooltip
            name="query"
            rules={[{ required: true, message: 'Введите поисковый запрос' }]}
            style={{ marginBottom: 12 }}
          >
            <Input placeholder="Введите название товара или услуги" allowClear autoComplete="off" />
          </FormItemWithTooltip>
        </Col>
        <Col>
          <Form.Item style={{ marginBottom: 12 }}>
            <Button type="primary" htmlType="submit" icon={<SearchOutlined />} loading={loading}>
              Найти
            </Button>
          </Form.Item>
        </Col>
      </Row>
      <Row gutter={12}>
        <Col xs={24} sm={12}>
          <Form.Item name="category" style={{ marginBottom: 0 }}>
            <Select
              placeholder="Категория"
              allowClear
              showSearch
              optionFilterProp="label"
              open={categoriesOpen}
              onOpenChange={(open) => {
                setCategoriesOpen(open)
                if (open && !categoriesQuery.data) {
                  void categoriesQuery.refetch()
                }
              }}
              loading={categoriesQuery.isLoading}
              options={categoriesQuery.data?.categories}
            />
          </Form.Item>
        </Col>
        <Col xs={24} sm={12}>
          <Form.Item name="manufacturer" style={{ marginBottom: 0 }}>
            <Select
              placeholder="Производитель"
              allowClear
              showSearch
              optionFilterProp="label"
              open={manufacturersOpen}
              onOpenChange={(open) => {
                setManufacturersOpen(open)
                if (open && !manufacturersQuery.data) {
                  void manufacturersQuery.refetch()
                }
              }}
              loading={manufacturersQuery.isLoading}
              options={manufacturersQuery.data?.manufacturers}
            />
          </Form.Item>
        </Col>
      </Row>
    </Form>
  )
}
