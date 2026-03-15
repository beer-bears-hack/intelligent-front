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
import type { CalculationMethod } from '@entities/calculation'
import { getPrices } from '@entities/price'
import { useSessionStore } from '@entities/session'
import { getRegions } from '@entities/ste'

import type { ManualPrice, CalculateItemResponse } from '@shared/contracts'
import { getErrorMessage } from '@shared/lib/get-error-message'
import { useIsMobile } from '@shared/lib/use-is-mobile'
import { PageContainer } from '@shared/ui/page-container'

import { METHOD_OPTIONS } from './model/constants'

export default function PriceAnalysisPage() {
  const { cteId } = useParams<{ cteId: string }>()
  const navigate = useNavigate()
  const { notification } = App.useApp()
  const ensureSession = useSessionStore((s) => s.ensureSession)
  const isMobile = useIsMobile()

  const [definedPrices, setDefinedPrices] = useState<Set<string>>(new Set())
  const [manualPrices, setManualPrices] = useState<ManualPrice[]>([])
  const [manualSelectedIndices, setManualSelectedIndices] = useState<Set<number>>(new Set())
  const [manualModalOpen, setManualModalOpen] = useState(false)

  const [quantity, setQuantity] = useState(1)
  const [method, setMethod] = useState<CalculationMethod>('comparable_market_prices')
  const [calcResult, setCalcResult] = useState<CalculateItemResponse | null>(null)

  const [region, setRegion] = useState<string | undefined>()
  const [period, setPeriod] = useState<number | undefined>()

  const pricesQuery = useQuery({
    queryKey: ['prices', cteId, region, period],
    queryFn: () => getPrices(cteId!, { region, period }),
    enabled: !!cteId,
    placeholderData: (prev) => prev,
  })

  const regionsQuery = useQuery({
    queryKey: ['regions'],
    queryFn: getRegions,
    enabled: false,
  })

  const priceRows = useMemo(
    () =>
      pricesQuery.data?.results.flatMap((item) =>
        item.prices.map((p) => ({
          ...p,
          cteId: item.cteId,
          similarityScore: item.similarityScore,
        })),
      ) ?? [],
    [pricesQuery.data],
  )

  const defaultSelectedIds = useMemo(() => {
    if (priceRows.length === 0) return new Set<string>()
    return new Set(priceRows.filter((p) => !p.isOutlier).map((p) => `${p.cteId}:${p.contractId}`))
  }, [priceRows])

  const [prevPrices, setPrevPrices] = useState(priceRows)
  if (priceRows !== prevPrices) {
    setPrevPrices(priceRows)
    setDefinedPrices(defaultSelectedIds)
    setCalcResult(null)
  }

  const handleToggle = useCallback((id: string) => {
    setDefinedPrices((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
    setCalcResult(null)
  }, [])

  const handleToggleAll = useCallback(
    (checked: boolean) => {
      if (checked) {
        setDefinedPrices(new Set(priceRows.map((p) => `${p.cteId}:${p.contractId}`)))
        setManualSelectedIndices(new Set(manualPrices.map((_, i) => i)))
      } else {
        setDefinedPrices(new Set())
        setManualSelectedIndices(new Set())
      }
      setCalcResult(null)
    },
    [priceRows, manualPrices],
  )

  const handleToggleManual = useCallback((idx: number) => {
    setManualSelectedIndices((prev) => {
      const next = new Set(prev)
      if (next.has(idx)) next.delete(idx)
      else next.add(idx)
      return next
    })
    setCalcResult(null)
  }, [])

  const handleAddManualPrice = useCallback((p: ManualPrice) => {
    setManualPrices((prev) => {
      const next = [...prev, p]
      setManualSelectedIndices(new Set(next.map((_, i) => i)))
      return next
    })
    setCalcResult(null)
  }, [])

  const activeManualPrices = useMemo(
    () => manualPrices.filter((_, idx) => manualSelectedIndices.has(idx)),
    [manualPrices, manualSelectedIndices],
  )

  const activeDefinedPrices = useMemo(
    () =>
      pricesQuery.data?.results.flatMap((item) =>
        item.prices
          .filter((p) => definedPrices.has(`${item.cteId}:${p.contractId}`))
          .map((p) => ({
            contractId: String(p.contractId),
            cteId: item.cteId,
            isOutlier: p.isOutlier,
            similarity: item.similarityScore,
          })),
      ) ?? [],
    [pricesQuery.data, definedPrices],
  )

  const isCalcDisabled = activeDefinedPrices.length === 0 && activeManualPrices.length === 0

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
      items: [
        ...activeDefinedPrices,
        ...activeManualPrices.map((p) => ({
          ...p,
          similarity: 1,
          cteId: pricesQuery.data?.cteDto.cteId,
        })),
      ],
      method,
    })
  }

  const addToCartMutation = useMutation({
    mutationFn: async () => {
      await ensureSession()
      if (!calcResult || !pricesQuery.data?.cteDto.cteId)
        throw new Error('Saving without needed data')

      return addToCart({
        cteId: pricesQuery.data.cteDto.cteId,
        ...calcResult,
      })
    },
    onSuccess: () => {
      notification.success({
        message: 'Добавлено в заказ',
        description: 'Расчёт сохранён.',
        btn: (
          <Button type="link" size="small" onClick={() => navigate('/cart')}>
            Перейти в заказ
          </Button>
        ),
        duration: 5,
      })
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
      {pricesQuery.isLoading ? (
        <div style={{ textAlign: 'center', padding: 24 }}>
          <Spin />
        </div>
      ) : pricesQuery.data?.cteDto ? (
        <Card size="small" style={{ marginBottom: 16 }}>
          <Descriptions
            column={isMobile ? 1 : 2}
            size="small"
            labelStyle={{ maxWidth: 200, wordBreak: 'break-word', whiteSpace: 'normal' }}
            contentStyle={{ maxWidth: 400, wordBreak: 'break-word', whiteSpace: 'normal' }}
          >
            <Descriptions.Item label="Название">
              {pricesQuery.data.cteDto.cteName}
            </Descriptions.Item>
            <Descriptions.Item label="Категория">
              {pricesQuery.data.cteDto.category}
            </Descriptions.Item>
            {Object.entries(pricesQuery.data.cteDto.characteristics ?? []).map(([key, value]) => (
              <Descriptions.Item key={key} label={key}>
                {String(value)}
              </Descriptions.Item>
            ))}
          </Descriptions>
        </Card>
      ) : null}

      <PriceChart prices={priceRows} manualPrices={manualPrices} />

      <div
        style={{
          display: 'flex',
          flexDirection: isMobile ? 'column' : 'row',
          gap: 16,
          marginTop: 16,
        }}
      >
        <div style={isMobile ? undefined : { flex: 2, minWidth: 0 }}>
          <Space wrap style={{ marginBottom: 0 }}>
            <Select
              placeholder="Регион"
              style={{ minWidth: 200 }}
              value={region}
              onChange={(v) => {
                setRegion(v || undefined)
                setCalcResult(null)
              }}
              onOpenChange={(open) => {
                if (open) void regionsQuery.refetch()
              }}
              loading={regionsQuery.isFetching}
              options={[
                { value: '', label: 'Все регионы' },
                ...(regionsQuery.data ?? []).map((r) => ({ value: r, label: r })),
              ]}
            />
            <Select
              placeholder="Период"
              style={{ minWidth: 160 }}
              value={period}
              onChange={(v) => {
                setPeriod(v || undefined)
                setCalcResult(null)
              }}
              options={[
                { value: 0, label: 'Любой период' },
                { value: 3, label: '3 месяца' },
                { value: 6, label: '6 месяцев' },
                { value: 12, label: '12 месяцев' },
              ]}
            />
          </Space>
          <PriceTable
            prices={priceRows}
            manualPrices={manualPrices}
            selectedIds={definedPrices}
            onToggle={handleToggle}
            onToggleAll={handleToggleAll}
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

            <div
              style={{
                transition: 'opacity 0.3s ease, max-height 0.3s ease',
                opacity: calcResult ? 1 : 0,
                maxHeight: calcResult ? 200 : 0,
                overflow: 'hidden',
              }}
            >
              <Button
                type="primary"
                block
                onClick={handleAddToCart}
                loading={addToCartMutation.isPending}
                icon={<ProfileOutlined />}
              >
                Добавить в заказ
              </Button>
            </div>
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
