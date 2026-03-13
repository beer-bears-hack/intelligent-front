export interface Session {
  session_id: string
  created_at?: string
}

export interface SessionState {
  items: CartItem[]
  total_price: number
}

export interface CartItem {
  item_id: string
  ste_id: string | null
  name: string
  quantity: number
  unit_price: number
  total_price: number
  justification_data?: {
    used_contract_ids: number[]
    manual_prices: { price: number; source: string }[]
  }
}

export interface AddItemRequest {
  ste_id: string | null
  name: string
  quantity: number
  unit_price: number
  total_price: number
  justification_data?: {
    used_contract_ids: number[]
    manual_prices: { price: number; source: string }[]
  }
}

export interface AddItemResponse {
  item_id: string
  cart_total: number
}
