export interface PriceEntry {
  id: number
  price: number
  date: string
  source: string
  is_outlier: boolean
  reason?: string
}

export interface PricesResponse {
  ste_id: string
  prices: PriceEntry[]
}

export interface ManualPrice {
  price: number
  source: string
}
