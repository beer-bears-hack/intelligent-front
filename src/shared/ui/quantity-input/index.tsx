import { MinusOutlined, PlusOutlined } from '@ant-design/icons'
import { InputNumber } from 'antd'

import { Button } from '@shared/ui/button'

interface QuantityInputProps {
  value?: number
  onChange?: (value: number) => void
  min?: number
  max?: number
  disabled?: boolean
}

export function QuantityInput({ value = 1, onChange, min = 1, max, disabled }: QuantityInputProps) {
  const handleChange = (next: number) => {
    if (next < min) return
    if (max !== undefined && next > max) return
    onChange?.(next)
  }

  return (
    <div style={{ display: 'flex', alignItems: 'center' }}>
      <Button
        icon={<MinusOutlined />}
        disabled={disabled ?? value <= min}
        onClick={() => handleChange(value - 1)}
        style={{ borderRadius: 0 }}
      />
      <InputNumber
        controls={false}
        value={value}
        min={min}
        max={max}
        disabled={disabled}
        onChange={(v) => v !== null && handleChange(v)}
        style={{ borderRadius: 0, width: 64, textAlign: 'center' }}
      />
      <Button
        icon={<PlusOutlined />}
        disabled={disabled ?? (max !== undefined && value >= max)}
        onClick={() => handleChange(value + 1)}
        style={{ borderRadius: 0 }}
      />
    </div>
  )
}
