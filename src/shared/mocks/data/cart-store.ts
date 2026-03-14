interface MockCartItem {
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

const store = new Map<string, MockCartItem[]>()

let nextItemId = 1

export const cartStore = {
  getItems(sessionId: string): MockCartItem[] {
    return store.get(sessionId) ?? []
  },

  addItem(sessionId: string, item: Omit<MockCartItem, 'item_id'>): MockCartItem {
    const items = this.getItems(sessionId)
    const newItem: MockCartItem = { ...item, item_id: `item-${nextItemId++}` }
    items.push(newItem)
    store.set(sessionId, items)
    return newItem
  },

  updateItem(
    sessionId: string,
    itemId: string,
    updates: { quantity?: number; unit_price?: number },
  ): MockCartItem | undefined {
    const items = this.getItems(sessionId)
    const item = items.find((i) => i.item_id === itemId)
    if (!item) return undefined

    if (updates.quantity !== undefined) item.quantity = updates.quantity
    if (updates.unit_price !== undefined) item.unit_price = updates.unit_price
    item.total_price = item.quantity * item.unit_price

    store.set(sessionId, items)
    return item
  },

  deleteItem(sessionId: string, itemId: string): boolean {
    const items = this.getItems(sessionId)
    const index = items.findIndex((i) => i.item_id === itemId)
    if (index === -1) return false
    items.splice(index, 1)
    store.set(sessionId, items)
    return true
  },

  getTotal(sessionId: string): number {
    return this.getItems(sessionId).reduce((sum, i) => sum + i.total_price, 0)
  },

  ensureSession(sessionId: string): void {
    if (!store.has(sessionId)) {
      store.set(sessionId, [])
    }
  },
}
