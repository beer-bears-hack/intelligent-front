import { Card, Descriptions, Spin, Tag, Typography } from 'antd'

import type { CalculateItemResponse } from '@entities/calculation'

import { formatPrice } from '@shared/lib/format'

interface CalculationSummaryProps {
  data: CalculateItemResponse | null
  loading: boolean
}

export function CalculationSummary({ data, loading }: CalculationSummaryProps) {
  return (
    <Card title="Результат расчёта" size="small">
      {loading && (
        <div style={{ textAlign: 'center', padding: 24 }}>
          <Spin />
        </div>
      )}

      {!loading && !data && <Typography.Text type="secondary">Выполните расчёт</Typography.Text>}

      {!loading && data && (
        <Descriptions column={1} size="small">
          <Descriptions.Item label="Цена за единицу">
            {formatPrice(data.unit_price)}
          </Descriptions.Item>
          <Descriptions.Item label="Общая стоимость">
            {formatPrice(data.total_price)}
          </Descriptions.Item>
          <Descriptions.Item label="Диапазон цен">
            {formatPrice(data.price_range.min)} — {formatPrice(data.price_range.max)}
          </Descriptions.Item>
          <Descriptions.Item label="Коэффициент вариации">
            <Typography.Text type={data.coeff_variation > 33 ? 'danger' : undefined}>
              {data.coeff_variation.toFixed(2)}%
            </Typography.Text>
          </Descriptions.Item>
          <Descriptions.Item label="Однородность">
            {data.is_homogeneous ? (
              <Tag color="green">Однородные</Tag>
            ) : (
              <Tag color="red">Неоднородные</Tag>
            )}
          </Descriptions.Item>
        </Descriptions>
      )}
    </Card>
  )
}
