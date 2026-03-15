import { SearchOutlined } from '@ant-design/icons'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { Alert, Card, Typography, Button, Empty, App } from 'antd'
import { useState } from 'react'
import { useNavigate } from 'react-router'

import { CartTable } from '@widgets/cart-table'

import { GenerateDocForm } from '@features/generate-document'
import { EditItemModal } from '@features/manage-cart-item'

import { generateDocument, downloadDocument } from '@entities/document'
import type { DocumentSettings } from '@entities/document'
import { useSessionStore, getSession, updateItem, deleteItem } from '@entities/session'

import type { SessionItem } from '@shared/contracts'
import { downloadBlob } from '@shared/lib/download'
import { formatPrice } from '@shared/lib/format'
import { getErrorMessage } from '@shared/lib/get-error-message'
import { useIsMobile } from '@shared/lib/use-is-mobile'
import { PageContainer } from '@shared/ui/page-container'

export default function CartPage() {
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const { notification } = App.useApp()
  const sessionId = useSessionStore((s) => s.sessionId)
  const isMobile = useIsMobile()

  const [editingItem, setEditingItem] = useState<SessionItem | null>(null)
  const [deletingId, setDeletingId] = useState<string | null>(null)

  const { data } = useQuery({
    queryKey: ['session', sessionId],
    queryFn: () => getSession(sessionId!),
    enabled: !!sessionId,
  })

  const updateMutation = useMutation({
    mutationFn: ({ itemId, quantity }: { itemId: string; quantity: number }) =>
      updateItem(sessionId!, itemId, { quantity }),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['session'] })
      setEditingItem(null)
    },
    onError: (error) => {
      notification.error({
        message: 'Ошибка при обновлении позиции',
        description: getErrorMessage(error),
        duration: 5,
      })
    },
  })

  const deleteMutation = useMutation({
    mutationFn: (itemId: string) => deleteItem(sessionId!, itemId),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['session'] })
      setDeletingId(null)
    },
    onError: (error) => {
      notification.error({
        message: 'Ошибка при удалении позиции',
        description: getErrorMessage(error),
        duration: 5,
      })
      setDeletingId(null)
    },
  })

  const docMutation = useMutation({
    mutationFn: async (settings: DocumentSettings) => {
      const response = await generateDocument({ session_id: sessionId!, settings })
      const blob = await downloadDocument(response.file_url)
      const filename = response.file_url.split('/').pop() ?? 'report.docx'
      downloadBlob(blob, filename)
      return response
    },
    onSuccess: () => {
      notification.success({
        message: 'Документ сформирован',
        description: 'Файл загружен автоматически.',
        duration: 2,
      })
    },
    onError: (error) => {
      notification.error({
        message: 'Ошибка',
        description: getErrorMessage(error, 'Не удалось сформировать документ. Попробуйте позже.'),
        duration: 5,
      })
    },
  })

  const handleUpdate = (itemId: string, quantity: number) => {
    updateMutation.mutate({ itemId, quantity })
  }

  const handleDelete = (itemId: string) => {
    setDeletingId(itemId)
    deleteMutation.mutate(itemId)
  }

  const handleGenerate = (settings: DocumentSettings) => {
    docMutation.mutate(settings)
  }

  const hasItems = !!data?.session.items.length

  return (
    <PageContainer
      title="Заказ"
      tooltip="Позиции для включения в обоснование НМЦК. Проверьте и сформируйте документ"
    >
      {sessionId ? (
        <>
          <CartTable
            items={data?.session.items ?? []}
            onEdit={setEditingItem}
            onDelete={handleDelete}
            deletingId={deletingId}
          />
          <Card style={{ marginTop: 16 }}>
            <div
              style={{
                display: 'flex',
                flexDirection: isMobile ? 'column' : 'row',
                justifyContent: 'space-between',
                alignItems: isMobile ? 'stretch' : 'center',
                gap: isMobile ? 12 : 0,
              }}
            >
              <Typography.Title level={4} style={{ margin: 0 }}>
                Итого:{' '}
                {formatPrice(
                  data?.session.items.reduce((sum, cur) => sum + cur.totalPrice, 0) ?? 0,
                )}
              </Typography.Title>
              <Button
                block={isMobile}
                onClick={() => navigate('/search')}
                icon={<SearchOutlined />}
              >
                Продолжить поиск
              </Button>
            </div>
          </Card>

          <Card title="Формирование документа" style={{ marginTop: 16 }}>
            {hasItems ? (
              <>
                <GenerateDocForm onGenerate={handleGenerate} loading={docMutation.isPending} />
                {docMutation.isSuccess && (
                  <Alert
                    style={{ marginTop: 16 }}
                    type="success"
                    title="Документ успешно сформирован"
                    description="Файл загружен автоматически."
                    showIcon
                  />
                )}
              </>
            ) : (
              <Typography.Text type="secondary">
                Добавьте позиции для формирования документа
              </Typography.Text>
            )}
          </Card>

          <EditItemModal
            open={!!editingItem}
            item={editingItem}
            onClose={() => setEditingItem(null)}
            onSave={handleUpdate}
            loading={updateMutation.isPending}
          />
        </>
      ) : (
        <Empty description="Сессия не найдена. Начните с поиска." />
      )}
    </PageContainer>
  )
}
