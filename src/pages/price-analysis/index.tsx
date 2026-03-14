import { PlusOutlined, ProfileOutlined, QuestionCircleOutlined } from '@ant-design/icons'
import { useQuery, useMutation } from '@tanstack/react-query'
import {
  App,
  Button,
  Card,
  Descriptions,
  InputNumber,
  Select,
  Space,
  Spin,
  Tooltip,
  Typography,
} from 'antd'
import { useCallback, useMemo, useState } from 'react'
import { useParams, useNavigate } from 'react-router'

import { CalculationSummary } from '@widgets/calculation-summary'
import { PriceChart } from '@widgets/price-chart'
import { PriceTable } from '@widgets/price-table'

import { ManualPriceForm } from '@features/add-manual-price'
import { addToCart } from '@features/add-to-cart'

import { calculateItem } from '@entities/calculation'
import type { CalculateItemResponse, CalculationMethod } from '@entities/calculation'
import { getPrices } from '@entities/price'
import type { ManualPrice } from '@entities/price'
import { useSessionStore } from '@entities/session'
import { getSte } from '@entities/ste'

import { getErrorMessage } from '@shared/lib/get-error-message'
import { useIsMobile } from '@shared/lib/use-is-mobile'
import { PageContainer } from '@shared/ui/page-container'

import { METHOD_OPTIONS } from './model/constants'

export default function PriceAnalysisPage() {
  const { steId } = useParams<{ steId: string }>()
  const navigate = useNavigate()
  const { notification } = App.useApp()
  const ensureSession = useSessionStore((s) => s.ensureSession)
  const isMobile = useIsMobile()

  const [selectedIds, setSelectedIds] = useState<Set<number>>(new Set())
  const [manualPrices, setManualPrices] = useState<ManualPrice[]>([])
  const [manualSelectedIndices, setManualSelectedIndices] = useState<Set<number>>(new Set())
  const [manualModalOpen, setManualModalOpen] = useState(false)

  const [quantity, setQuantity] = useState(1)
  const [method, setMethod] = useState<CalculationMethod>('comparable_market_prices')
  const [calcResult, setCalcResult] = useState<CalculateItemResponse | null>(null)

  const steQuery = useQuery({
    queryKey: ['ste', steId],
    queryFn: () => getSte(steId!),
    enabled: !!steId,
  })

  // Fetch prices (no region/period filters)
  const pricesQuery = useQuery({
    queryKey: ['prices', steId],
    queryFn: () => getPrices(steId!),
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

  // Toggle manual price selection
  const handleToggleManual = useCallback((idx: number) => {
    setManualSelectedIndices((prev) => {
      const next = new Set(prev)
      if (next.has(idx)) {
        next.delete(idx)
      } else {
        next.add(idx)
      }
      return next
    })
  }, [])

  // Add manual price
  const handleAddManualPrice = useCallback((p: ManualPrice) => {
    setManualPrices((prev) => {
      const next = [...prev, p]
      // Auto-select all manual indices
      setManualSelectedIndices(new Set(next.map((_, i) => i)))
      return next
    })
  }, [])

  // Filter manual prices by selected indices
  const activeManualPrices = useMemo(
    () => manualPrices.filter((_, idx) => manualSelectedIndices.has(idx)),
    [manualPrices, manualSelectedIndices],
  )

  const isCalcDisabled = selectedIds.size === 0 && activeManualPrices.length === 0

  // Calculate
  const calcMutation = useMutation({
    mutationFn: calculateItem,
    onSuccess: (data) => {
      setCalcResult(data)
    },
    onError: (error) => {
      notification.error({
        message: 'Ошибка расчёта',
        description: getErrorMessage(error),
        duration: 5,
      })
    },
  })

  const handleCalculate = () => {
    calcMutation.mutate({
      quantity,
      selected_price_ids: [...selectedIds],
      manual_prices: activeManualPrices.length > 0 ? activeManualPrices : undefined,
      method,
    })
  }

  // Add to cart
  const addToCartMutation = useMutation({
    mutationFn: async () => {
      const sid = await ensureSession()
      return addToCart(sid, {
        ste_id: steId ?? null,
        name: steQuery.data?.name ?? `СТЕ ${steId}`,
        quantity,
        unit_price: calcResult!.unit_price,
        total_price: calcResult!.total_price,
        justification_data: {
          used_contract_ids: [...selectedIds],
          manual_prices: activeManualPrices,
        },
      })
    },
    onSuccess: () => {
      notification.success({
        message: 'Добавлено в заказ',
        description: 'Перейдите в заказ для генерации документа',
        duration: 2,
      })
      void navigate('/cart')
    },
    onError: (error) => {
      notification.error({
        message: 'Ошибка добавления в заказ',
        description: getErrorMessage(error),
        duration: 5,
      })
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
      {steQuery.isLoading ? (
        <div style={{ textAlign: 'center', padding: 24 }}>
          <Spin />
        </div>
      ) : steQuery.data ? (
        <Card size="small" style={{ marginBottom: 16 }}>
          <Descriptions column={isMobile ? 1 : 2} size="small">
            <Descriptions.Item label="Название">{steQuery.data.name}</Descriptions.Item>
            <Descriptions.Item label="Категория">{steQuery.data.category}</Descriptions.Item>
            {Object.entries(steQuery.data.characteristics).map(([key, value]) => (
              <Descriptions.Item key={key} label={key}>
                {String(value)}
              </Descriptions.Item>
            ))}
          </Descriptions>
        </Card>
      ) : null}

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
            manualSelectedIndices={manualSelectedIndices}
            onToggleManual={handleToggleManual}
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
                    options={METHOD_OPTIONS}
                  />
                </div>
                <Tooltip title={isCalcDisabled ? 'Выберите хотя бы одну цену' : undefined}>
                  <span style={{ display: 'block' }}>
                    <Button
                      type="primary"
                      block
                      onClick={handleCalculate}
                      loading={calcMutation.isPending}
                      disabled={isCalcDisabled}
                    >
                      Рассчитать
                    </Button>
                  </span>
                </Tooltip>
              </Space>
            </Card>

            <CalculationSummary data={calcResult} loading={calcMutation.isPending} />

            {calcResult && (
              <Button
                type="primary"
                block
                onClick={handleAddToCart}
                loading={addToCartMutation.isPending}
                icon={<ProfileOutlined />}
              >
                Добавить в заказ
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
