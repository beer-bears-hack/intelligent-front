import { PlusOutlined, ShoppingCartOutlined, QuestionCircleOutlined } from '@ant-design/icons'
import { useQuery, useMutation } from '@tanstack/react-query'
import { App, Button, Card, InputNumber, Select, Space, Tooltip, Typography } from 'antd'
import { useCallback, useMemo, useState } from 'react'
import { useParams, useNavigate } from 'react-router'

import { CalculationSummary } from '@widgets/calculation-summary'
import { PriceChart } from '@widgets/price-chart'
import { PriceTable } from '@widgets/price-table'

import { ManualPriceForm } from '@features/add-manual-price'
import { addToCart } from '@features/add-to-cart'
import { PriceFilters } from '@features/filter-prices'

import { calculateItem } from '@entities/calculation'
import type { CalculateItemResponse, CalculationMethod } from '@entities/calculation'
import { getPrices } from '@entities/price'
import type { ManualPrice } from '@entities/price'
import { useSessionStore } from '@entities/session'

import { useIsMobile } from '@shared/lib/use-is-mobile'
import { PageContainer } from '@shared/ui/page-container'

const methodOptions = [
  { value: 'comparable_market_prices', label: 'Сопоставимые рыночные цены' },
  { value: 'tariff', label: 'Тарифный метод' },
  { value: 'cost', label: 'Затратный метод' },
]

export default function PriceAnalysisPage() {
  const { steId } = useParams<{ steId: string }>()
  const navigate = useNavigate()
  const { notification } = App.useApp()
  const ensureSession = useSessionStore((s) => s.ensureSession)
  const isMobile = useIsMobile()

  // Filter state
  const [region, setRegion] = useState('')
  const [period, setPeriod] = useState(12)

  // Selection & manual prices
  const [selectedIds, setSelectedIds] = useState<Set<number>>(new Set())
  const [manualPrices, setManualPrices] = useState<ManualPrice[]>([])
  const [manualModalOpen, setManualModalOpen] = useState(false)

  // Calculation params
  const [quantity, setQuantity] = useState(1)
  const [method, setMethod] = useState<CalculationMethod>('comparable_market_prices')
  const [calcResult, setCalcResult] = useState<CalculateItemResponse | null>(null)

  // Fetch prices
  const pricesQuery = useQuery({
    queryKey: ['prices', steId, region, period],
    queryFn: () => getPrices(steId!, { region: region || undefined, period }),
    enabled: !!steId,
  })

  const prices = useMemo(() => pricesQuery.data?.prices ?? [], [pricesQuery.data])

  // Auto-select non-outlier prices when data changes
  const defaultSelectedIds = useMemo(() => {
    if (prices.length === 0) return new Set<number>()
    return new Set(prices.filter((p) => !p.is_outlier).map((p) => p.id))
  }, [prices])

  // Sync selection when prices change (reset to defaults)
  const [prevPrices, setPrevPrices] = useState(prices)
  if (prices !== prevPrices) {
    setPrevPrices(prices)
    setSelectedIds(defaultSelectedIds)
  }

  // Toggle price selection
  const handleToggle = useCallback((id: number) => {
    setSelectedIds((prev) => {
      const next = new Set(prev)
      if (next.has(id)) {
        next.delete(id)
      } else {
        next.add(id)
      }
      return next
    })
  }, [])

  // Add manual price
  const handleAddManualPrice = useCallback((p: ManualPrice) => {
    setManualPrices((prev) => [...prev, p])
  }, [])

  // Calculate
  const calcMutation = useMutation({
    mutationFn: calculateItem,
    onSuccess: (data) => {
      setCalcResult(data)
    },
    onError: () => {
      notification.error({ message: 'Ошибка расчёта' })
    },
  })

  const handleCalculate = () => {
    calcMutation.mutate({
      quantity,
      selected_price_ids: [...selectedIds],
      manual_prices: manualPrices.length > 0 ? manualPrices : undefined,
      method,
    })
  }

  // Add to cart
  const addToCartMutation = useMutation({
    mutationFn: async () => {
      const sid = await ensureSession()
      return addToCart(sid, {
        ste_id: steId ?? null,
        name: `СТЕ ${steId}`,
        quantity,
        unit_price: calcResult!.unit_price,
        total_price: calcResult!.total_price,
        justification_data: {
          used_contract_ids: [...selectedIds],
          manual_prices: manualPrices,
        },
      })
    },
    onSuccess: () => {
      notification.success({ message: 'Добавлено в корзину' })
      void navigate('/cart')
    },
    onError: () => {
      notification.error({ message: 'Ошибка добавления в корзину' })
    },
  })

  const handleAddToCart = () => {
    addToCartMutation.mutate()
  }

  return (
    <PageContainer
      title="Анализ цен"
      tooltip="Выберите ценовые предложения и рассчитайте НМЦК выбранным методом"
    >
      <PriceFilters
        region={region}
        period={period}
        onRegionChange={setRegion}
        onPeriodChange={setPeriod}
      />

      <PriceChart prices={prices} manualPrices={manualPrices} />

      <div
        style={{
          display: 'flex',
          flexDirection: isMobile ? 'column' : 'row',
          gap: 16,
          marginTop: 16,
        }}
      >
        <div style={isMobile ? undefined : { flex: 2, minWidth: 0 }}>
          <PriceTable
            prices={prices}
            manualPrices={manualPrices}
            selectedIds={selectedIds}
            onToggle={handleToggle}
            loading={pricesQuery.isLoading}
          />
          <Space style={{ marginTop: 16 }}>
            <Button onClick={() => setManualModalOpen(true)} icon={<PlusOutlined />}>
              Добавить цену вручную
            </Button>
          </Space>
        </div>

        <div style={isMobile ? undefined : { flex: 1, minWidth: 280 }}>
          <Space orientation="vertical" style={{ width: '100%' }} size="middle">
            <Card
              title={
                <span>
                  Параметры расчёта{' '}
                  <Tooltip title="Укажите количество и метод для расчёта НМЦК">
                    <QuestionCircleOutlined style={{ color: '#8c8c8c', fontSize: 14 }} />
                  </Tooltip>
                </span>
              }
              size="small"
            >
              <Space orientation="vertical" style={{ width: '100%' }}>
                <div>
                  <Typography.Text>Количество:</Typography.Text>
                  <InputNumber
                    min={1}
                    value={quantity}
                    onChange={(v) => setQuantity(v ?? 1)}
                    style={{ width: '100%' }}
                  />
                </div>
                <div>
                  <Typography.Text>Метод расчёта:</Typography.Text>
                  <Select
                    value={method}
                    onChange={setMethod}
                    style={{ width: '100%' }}
                    options={methodOptions}
                  />
                </div>
                <Button
                  type="primary"
                  block
                  onClick={handleCalculate}
                  loading={calcMutation.isPending}
                  disabled={selectedIds.size === 0 && manualPrices.length === 0}
                >
                  Рассчитать
                </Button>
              </Space>
            </Card>

            <CalculationSummary data={calcResult} loading={calcMutation.isPending} />

            {calcResult && (
              <Button
                type="primary"
                block
                onClick={handleAddToCart}
                loading={addToCartMutation.isPending}
                icon={<ShoppingCartOutlined />}
              >
                Добавить в корзину
              </Button>
            )}
          </Space>
        </div>
      </div>

      <ManualPriceForm
        open={manualModalOpen}
        onClose={() => setManualModalOpen(false)}
        onAdd={handleAddManualPrice}
      />

      <style>{`
        .price-row-outlier {
          background-color: #fff1f0 !important;
        }
        .price-row-outlier:hover > td {
          background-color: #ffccc7 !important;
        }
      `}</style>
    </PageContainer>
  )
}
