interface MockCartItem {
  name: string
  category: string
  quantity: number
  unitPrice: number
  totalPrice: number
}

const store = new Map<string, MockCartItem[]>()

export const cartStore = {
  getItems(sessionId: string): MockCartItem[] {
    return store.get(sessionId) ?? []
  },

  addItem(sessionId: string, item: MockCartItem): MockCartItem {
    const items = this.getItems(sessionId)
    items.push(item)
    store.set(sessionId, items)
    return item
  },

  updateItem(
    sessionId: string,
    itemId: string,
    updates: { quantity?: number; unitPrice?: number },
  ): MockCartItem | undefined {
    const items = this.getItems(sessionId)
    const item = items.find((i) => i.name === itemId)
    if (!item) return undefined

    if (updates.quantity !== undefined) item.quantity = updates.quantity
    if (updates.unitPrice !== undefined) item.unitPrice = updates.unitPrice
    item.totalPrice = item.quantity * item.unitPrice

    store.set(sessionId, items)
    return item
  },

  deleteItem(sessionId: string, itemId: string): boolean {
    const items = this.getItems(sessionId)
    const index = items.findIndex((i) => i.name === itemId)
    if (index === -1) return false
    items.splice(index, 1)
    store.set(sessionId, items)
    return true
  },

  getTotal(sessionId: string): number {
    return this.getItems(sessionId).reduce((sum, i) => sum + i.totalPrice, 0)
  },

  ensureSession(sessionId: string): void {
    if (!store.has(sessionId)) {
      store.set(sessionId, [])
    }
  },
}
