interface MockPriceEntry {
  id: number
  price: number
  date: string
  source: string
  is_outlier: boolean
  reason?: string
}

type PriceMap = Record<string, MockPriceEntry[]>

export const pricesBySteId: PriceMap = {
  'ste-001': [
    { id: 1, price: 320, date: '2025-12-15', source: 'ЕИС Контракт №1234', is_outlier: false },
    { id: 2, price: 335, date: '2025-11-20', source: 'ЕИС Контракт №5678', is_outlier: false },
    {
      id: 3,
      price: 310,
      date: '2025-10-05',
      source: 'Коммерческое предложение ООО "Офис"',
      is_outlier: false,
    },
    { id: 4, price: 345, date: '2025-09-18', source: 'ЕИС Контракт №9012', is_outlier: false },
    {
      id: 5,
      price: 550,
      date: '2025-08-01',
      source: 'Коммерческое предложение ИП Сидоров',
      is_outlier: true,
      reason: 'Отклонение более 33% от среднего',
    },
    { id: 6, price: 325, date: '2026-01-10', source: 'ЕИС Контракт №3456', is_outlier: false },
  ],
  'ste-002': [
    { id: 7, price: 180, date: '2025-12-01', source: 'ЕИС Контракт №2345', is_outlier: false },
    {
      id: 8,
      price: 175,
      date: '2025-11-15',
      source: 'Коммерческое предложение ООО "Бумага+"',
      is_outlier: false,
    },
    { id: 9, price: 190, date: '2025-10-20', source: 'ЕИС Контракт №6789', is_outlier: false },
    { id: 10, price: 170, date: '2025-09-05', source: 'ЕИС Контракт №0123', is_outlier: false },
    {
      id: 11,
      price: 185,
      date: '2026-01-05',
      source: 'Коммерческое предложение ООО "Канцмир"',
      is_outlier: false,
    },
  ],
  'ste-003': [
    { id: 12, price: 4200, date: '2025-12-10', source: 'ЕИС Контракт №4567', is_outlier: false },
    {
      id: 13,
      price: 4500,
      date: '2025-11-25',
      source: 'Коммерческое предложение ООО "ПринтСервис"',
      is_outlier: false,
    },
    { id: 14, price: 4350, date: '2025-10-15', source: 'ЕИС Контракт №8901', is_outlier: false },
    { id: 15, price: 4100, date: '2025-09-20', source: 'ЕИС Контракт №2345', is_outlier: false },
    {
      id: 16,
      price: 7800,
      date: '2025-08-10',
      source: 'Коммерческое предложение ИП Петров',
      is_outlier: true,
      reason: 'Отклонение более 33% от среднего',
    },
    { id: 17, price: 4280, date: '2026-01-08', source: 'ЕИС Контракт №6780', is_outlier: false },
    {
      id: 18,
      price: 4400,
      date: '2025-07-15',
      source: 'Коммерческое предложение ООО "ТехноТорг"',
      is_outlier: false,
    },
  ],
  'ste-005': [
    { id: 19, price: 15_800, date: '2025-12-20', source: 'ЕИС Контракт №7890', is_outlier: false },
    {
      id: 20,
      price: 16_200,
      date: '2025-11-10',
      source: 'Коммерческое предложение ООО "МониторПро"',
      is_outlier: false,
    },
    { id: 21, price: 15_500, date: '2025-10-25', source: 'ЕИС Контракт №1230', is_outlier: false },
    { id: 22, price: 16_500, date: '2025-09-15', source: 'ЕИС Контракт №4560', is_outlier: false },
    {
      id: 23,
      price: 15_900,
      date: '2026-01-12',
      source: 'Коммерческое предложение ООО "КомпТех"',
      is_outlier: false,
    },
    {
      id: 24,
      price: 25_000,
      date: '2025-08-05',
      source: 'ИП Иванова',
      is_outlier: true,
      reason: 'Отклонение более 33% от среднего',
    },
  ],
  'ste-007': [
    { id: 25, price: 8500, date: '2025-12-05', source: 'ЕИС Контракт №5670', is_outlier: false },
    {
      id: 26,
      price: 8800,
      date: '2025-11-18',
      source: 'Коммерческое предложение ООО "МебельОфис"',
      is_outlier: false,
    },
    { id: 27, price: 8200, date: '2025-10-10', source: 'ЕИС Контракт №9010', is_outlier: false },
    {
      id: 28,
      price: 9100,
      date: '2025-09-22',
      source: 'Коммерческое предложение ООО "СтулПром"',
      is_outlier: false,
    },
    { id: 29, price: 8650, date: '2026-01-15', source: 'ЕИС Контракт №3450', is_outlier: false },
  ],
  'ste-009': [
    { id: 30, price: 750, date: '2025-12-12', source: 'ЕИС Контракт №6781', is_outlier: false },
    {
      id: 31,
      price: 790,
      date: '2025-11-08',
      source: 'Коммерческое предложение ООО "КлавМир"',
      is_outlier: false,
    },
    { id: 32, price: 720, date: '2025-10-22', source: 'ЕИС Контракт №0124', is_outlier: false },
    { id: 33, price: 760, date: '2025-09-30', source: 'ЕИС Контракт №4561', is_outlier: false },
    {
      id: 34,
      price: 1350,
      date: '2025-08-15',
      source: 'ИП Козлов',
      is_outlier: true,
      reason: 'Отклонение более 33% от среднего',
    },
    {
      id: 35,
      price: 740,
      date: '2026-01-18',
      source: 'Коммерческое предложение ООО "ПериферияПлюс"',
      is_outlier: false,
    },
  ],
  'ste-012': [
    { id: 36, price: 62_000, date: '2025-12-08', source: 'ЕИС Контракт №7891', is_outlier: false },
    {
      id: 37,
      price: 64_500,
      date: '2025-11-22',
      source: 'Коммерческое предложение ООО "ЛэптопТорг"',
      is_outlier: false,
    },
    { id: 38, price: 61_000, date: '2025-10-18', source: 'ЕИС Контракт №1231', is_outlier: false },
    { id: 39, price: 63_200, date: '2025-09-25', source: 'ЕИС Контракт №4562', is_outlier: false },
    {
      id: 40,
      price: 65_800,
      date: '2026-01-20',
      source: 'Коммерческое предложение ООО "КомпьютерСити"',
      is_outlier: false,
    },
  ],
}

export function generateFallbackPrices(steId: string): MockPriceEntry[] {
  const base = (Math.abs(hashCode(steId)) % 50_000) + 1000
  return [
    { id: 100, price: base, date: '2025-12-01', source: 'ЕИС Контракт №0001', is_outlier: false },
    {
      id: 101,
      price: base * 1.05,
      date: '2025-11-15',
      source: 'Коммерческое предложение ООО "Поставщик"',
      is_outlier: false,
    },
    {
      id: 102,
      price: base * 0.97,
      date: '2025-10-20',
      source: 'ЕИС Контракт №0002',
      is_outlier: false,
    },
    {
      id: 103,
      price: base * 1.02,
      date: '2025-09-10',
      source: 'ЕИС Контракт №0003',
      is_outlier: false,
    },
    {
      id: 104,
      price: base * 1.6,
      date: '2025-08-05',
      source: 'ИП Завышенный',
      is_outlier: true,
      reason: 'Отклонение более 33% от среднего',
    },
  ]
}

function hashCode(s: string): number {
  let h = 0
  for (const char of s) {
    h = Math.trunc(Math.imul(31, h) + char.codePointAt(0)!)
  }
  return h
}
