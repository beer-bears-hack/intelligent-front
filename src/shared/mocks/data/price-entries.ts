interface MockPriceEntry {
  contractId: number
  price: number
  date: string
  source: string
  isOutlier: boolean
  reason?: string
}

type PriceMap = Record<string, MockPriceEntry[]>

export const pricesBySteId: PriceMap = {
  'ste-001': [
    {
      contractId: 1,
      price: 320,
      date: '2025-12-15',
      source: 'ЕИС Контракт №1234',
      isOutlier: false,
    },
    {
      contractId: 2,
      price: 335,
      date: '2025-11-20',
      source: 'ЕИС Контракт №5678',
      isOutlier: false,
    },
    {
      contractId: 3,
      price: 310,
      date: '2025-10-05',
      source: 'Коммерческое предложение ООО "Офис"',
      isOutlier: false,
    },
    {
      contractId: 4,
      price: 345,
      date: '2025-09-18',
      source: 'ЕИС Контракт №9012',
      isOutlier: false,
    },
    {
      contractId: 5,
      price: 550,
      date: '2025-08-01',
      source: 'Коммерческое предложение ИП Сидоров',
      isOutlier: true,
      reason: 'Отклонение более 33% от среднего',
    },
    {
      contractId: 6,
      price: 325,
      date: '2026-01-10',
      source: 'ЕИС Контракт №3456',
      isOutlier: false,
    },
  ],
  'ste-002': [
    {
      contractId: 7,
      price: 180,
      date: '2025-12-01',
      source: 'ЕИС Контракт №2345',
      isOutlier: false,
    },
    {
      contractId: 8,
      price: 175,
      date: '2025-11-15',
      source: 'Коммерческое предложение ООО "Бумага+"',
      isOutlier: false,
    },
    {
      contractId: 9,
      price: 190,
      date: '2025-10-20',
      source: 'ЕИС Контракт №6789',
      isOutlier: false,
    },
    {
      contractId: 10,
      price: 170,
      date: '2025-09-05',
      source: 'ЕИС Контракт №0123',
      isOutlier: false,
    },
    {
      contractId: 11,
      price: 185,
      date: '2026-01-05',
      source: 'Коммерческое предложение ООО "Канцмир"',
      isOutlier: false,
    },
  ],
  'ste-003': [
    {
      contractId: 12,
      price: 4200,
      date: '2025-12-10',
      source: 'ЕИС Контракт №4567',
      isOutlier: false,
    },
    {
      contractId: 13,
      price: 4500,
      date: '2025-11-25',
      source: 'Коммерческое предложение ООО "ПринтСервис"',
      isOutlier: false,
    },
    {
      contractId: 14,
      price: 4350,
      date: '2025-10-15',
      source: 'ЕИС Контракт №8901',
      isOutlier: false,
    },
    {
      contractId: 15,
      price: 4100,
      date: '2025-09-20',
      source: 'ЕИС Контракт №2345',
      isOutlier: false,
    },
    {
      contractId: 16,
      price: 7800,
      date: '2025-08-10',
      source: 'Коммерческое предложение ИП Петров',
      isOutlier: true,
      reason: 'Отклонение более 33% от среднего',
    },
    {
      contractId: 17,
      price: 4280,
      date: '2026-01-08',
      source: 'ЕИС Контракт №6780',
      isOutlier: false,
    },
    {
      contractId: 18,
      price: 4400,
      date: '2025-07-15',
      source: 'Коммерческое предложение ООО "ТехноТорг"',
      isOutlier: false,
    },
  ],
  'ste-005': [
    {
      contractId: 19,
      price: 15_800,
      date: '2025-12-20',
      source: 'ЕИС Контракт №7890',
      isOutlier: false,
    },
    {
      contractId: 20,
      price: 16_200,
      date: '2025-11-10',
      source: 'Коммерческое предложение ООО "МониторПро"',
      isOutlier: false,
    },
    {
      contractId: 21,
      price: 15_500,
      date: '2025-10-25',
      source: 'ЕИС Контракт №1230',
      isOutlier: false,
    },
    {
      contractId: 22,
      price: 16_500,
      date: '2025-09-15',
      source: 'ЕИС Контракт №4560',
      isOutlier: false,
    },
    {
      contractId: 23,
      price: 15_900,
      date: '2026-01-12',
      source: 'Коммерческое предложение ООО "КомпТех"',
      isOutlier: false,
    },
    {
      contractId: 24,
      price: 25_000,
      date: '2025-08-05',
      source: 'ИП Иванова',
      isOutlier: true,
      reason: 'Отклонение более 33% от среднего',
    },
  ],
  'ste-007': [
    {
      contractId: 25,
      price: 8500,
      date: '2025-12-05',
      source: 'ЕИС Контракт №5670',
      isOutlier: false,
    },
    {
      contractId: 26,
      price: 8800,
      date: '2025-11-18',
      source: 'Коммерческое предложение ООО "МебельОфис"',
      isOutlier: false,
    },
    {
      contractId: 27,
      price: 8200,
      date: '2025-10-10',
      source: 'ЕИС Контракт №9010',
      isOutlier: false,
    },
    {
      contractId: 28,
      price: 9100,
      date: '2025-09-22',
      source: 'Коммерческое предложение ООО "СтулПром"',
      isOutlier: false,
    },
    {
      contractId: 29,
      price: 8650,
      date: '2026-01-15',
      source: 'ЕИС Контракт №3450',
      isOutlier: false,
    },
  ],
  'ste-009': [
    {
      contractId: 30,
      price: 750,
      date: '2025-12-12',
      source: 'ЕИС Контракт №6781',
      isOutlier: false,
    },
    {
      contractId: 31,
      price: 790,
      date: '2025-11-08',
      source: 'Коммерческое предложение ООО "КлавМир"',
      isOutlier: false,
    },
    {
      contractId: 32,
      price: 720,
      date: '2025-10-22',
      source: 'ЕИС Контракт №0124',
      isOutlier: false,
    },
    {
      contractId: 33,
      price: 760,
      date: '2025-09-30',
      source: 'ЕИС Контракт №4561',
      isOutlier: false,
    },
    {
      contractId: 34,
      price: 1350,
      date: '2025-08-15',
      source: 'ИП Козлов',
      isOutlier: true,
      reason: 'Отклонение более 33% от среднего',
    },
    {
      contractId: 35,
      price: 740,
      date: '2026-01-18',
      source: 'Коммерческое предложение ООО "ПериферияПлюс"',
      isOutlier: false,
    },
  ],
  'ste-012': [
    {
      contractId: 36,
      price: 62_000,
      date: '2025-12-08',
      source: 'ЕИС Контракт №7891',
      isOutlier: false,
    },
    {
      contractId: 37,
      price: 64_500,
      date: '2025-11-22',
      source: 'Коммерческое предложение ООО "ЛэптопТорг"',
      isOutlier: false,
    },
    {
      contractId: 38,
      price: 61_000,
      date: '2025-10-18',
      source: 'ЕИС Контракт №1231',
      isOutlier: false,
    },
    {
      contractId: 39,
      price: 63_200,
      date: '2025-09-25',
      source: 'ЕИС Контракт №4562',
      isOutlier: false,
    },
    {
      contractId: 40,
      price: 65_800,
      date: '2026-01-20',
      source: 'Коммерческое предложение ООО "КомпьютерСити"',
      isOutlier: false,
    },
  ],
}

export function generateFallbackPrices(steId: string): MockPriceEntry[] {
  const base = (Math.abs(hashCode(steId)) % 50_000) + 1000
  return [
    {
      contractId: 100,
      price: base,
      date: '2025-12-01',
      source: 'ЕИС Контракт №0001',
      isOutlier: false,
    },
    {
      contractId: 101,
      price: base * 1.05,
      date: '2025-11-15',
      source: 'Коммерческое предложение ООО "Поставщик"',
      isOutlier: false,
    },
    {
      contractId: 102,
      price: base * 0.97,
      date: '2025-10-20',
      source: 'ЕИС Контракт №0002',
      isOutlier: false,
    },
    {
      contractId: 103,
      price: base * 1.02,
      date: '2025-09-10',
      source: 'ЕИС Контракт №0003',
      isOutlier: false,
    },
    {
      contractId: 104,
      price: base * 1.6,
      date: '2025-08-05',
      source: 'ИП Завышенный',
      isOutlier: true,
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
