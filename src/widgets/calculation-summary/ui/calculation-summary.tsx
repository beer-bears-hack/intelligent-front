import { QuestionCircleOutlined } from '@ant-design/icons'
import { Card, Descriptions, Spin, Tag, Tooltip, Typography } from 'antd'

import type { CalculateItemResponse } from '@shared/contracts'
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

      <div style={{ transition: 'opacity 0.2s ease', opacity: !loading && data ? 1 : 0 }}>
        {!loading && data && (
          <Descriptions column={1} size="small">
            <Descriptions.Item label="Цена за единицу">
              {formatPrice(data.unitPrice)}
            </Descriptions.Item>
            <Descriptions.Item label="Общая стоимость">
              {formatPrice(data.totalPrice)}
            </Descriptions.Item>
            <Descriptions.Item label="Диапазон цен">
              {formatPrice(data.priceRange.min)} — {formatPrice(data.priceRange.max)}
            </Descriptions.Item>
            <Descriptions.Item
              label={
                <span>
                  Коэффициент вариации{' '}
                  <Tooltip title="Если > 33%, цены неоднородны — рекомендуется пересмотреть выборку">
                    <QuestionCircleOutlined style={{ color: '#8c8c8c', fontSize: 12 }} />
                  </Tooltip>
                </span>
              }
            >
              <Typography.Text type={data.coeffVariation > 33 ? 'danger' : undefined}>
                {data.coeffVariation.toFixed(2)}%
              </Typography.Text>
            </Descriptions.Item>
            <Descriptions.Item label="Однородность">
              {data.isHomogeneous ? (
                <Tag variant="outlined" color="green">
                  Однородные
                </Tag>
              ) : (
                <Tag variant="outlined" color="red">
                  Неоднородные
                </Tag>
              )}
            </Descriptions.Item>
          </Descriptions>
        )}
      </div>
    </Card>
  )
}
