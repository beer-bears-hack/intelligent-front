export interface CalculateItemRequest {
  quantity: number
  selected_price_ids: number[]
  manual_prices?: { price: number; source: string }[]
  method: CalculationMethod
}

export type CalculationMethod = 'comparable_market_prices' | 'tariff' | 'cost'

export interface CalculateItemResponse {
  unit_price: number
  total_price: number
  price_range: { min: number; max: number }
  coeff_variation: number
  is_homogeneous: boolean
}
