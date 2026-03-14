import { Input, Select, Space } from 'antd'

interface PriceFiltersProps {
  region: string
  period: number
  onRegionChange: (v: string) => void
  onPeriodChange: (v: number) => void
}

const periodOptions = [
  { value: 6, label: '6 месяцев' },
  { value: 12, label: '12 месяцев' },
  { value: 24, label: '24 месяца' },
]

export function PriceFilters({
  region,
  period,
  onRegionChange,
  onPeriodChange,
}: PriceFiltersProps) {
  return (
    <Space wrap>
      <Input
        placeholder="Код региона"
        allowClear
        value={region || undefined}
        onChange={(e) => onRegionChange(e.target.value)}
        style={{ width: 180 }}
      />
      <Select
        value={period}
        onChange={onPeriodChange}
        options={periodOptions}
        style={{ width: 160 }}
      />
    </Space>
  )
}
