import { SearchOutlined, FileTextOutlined } from '@ant-design/icons'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { Card, Typography, Button, Space, Empty, App } from 'antd'
import { useState } from 'react'
import { useNavigate } from 'react-router'

import { CartTable } from '@widgets/cart-table'

import { EditItemModal } from '@features/manage-cart-item'

import type { CartItem } from '@entities/session'
import { useSessionStore, getSession, updateItem, deleteItem } from '@entities/session'

import { formatPrice } from '@shared/lib/format'
import { PageContainer } from '@shared/ui/PageContainer'

export default function CartPage() {
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const { notification } = App.useApp()
  const sessionId = useSessionStore((s) => s.sessionId)

  const [editingItem, setEditingItem] = useState<CartItem | null>(null)
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
    onError: () => {
      notification.error({ message: 'Ошибка при обновлении позиции' })
    },
  })

  const deleteMutation = useMutation({
    mutationFn: (itemId: string) => deleteItem(sessionId!, itemId),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['session'] })
      setDeletingId(null)
    },
    onError: () => {
      notification.error({ message: 'Ошибка при удалении позиции' })
      setDeletingId(null)
    },
  })

  const handleUpdate = (itemId: string, quantity: number) => {
    updateMutation.mutate({ itemId, quantity })
  }

  const handleDelete = (itemId: string) => {
    setDeletingId(itemId)
    deleteMutation.mutate(itemId)
  }

  return (
    <PageContainer title="Корзина">
      {sessionId ? (
        <>
          <CartTable
            items={data?.items ?? []}
            onEdit={setEditingItem}
            onDelete={handleDelete}
            deletingId={deletingId}
          />
          <Card style={{ marginTop: 16 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Typography.Title level={4} style={{ margin: 0 }}>
                Итого: {formatPrice(data?.total_price ?? 0)}
              </Typography.Title>
              <Space>
                <Button onClick={() => navigate('/search')} icon={<SearchOutlined />}>
                  Продолжить поиск
                </Button>
                <Button
                  type="primary"
                  onClick={() => navigate('/document')}
                  icon={<FileTextOutlined />}
                  disabled={!data?.items.length}
                >
                  Сформировать документ
                </Button>
              </Space>
            </div>
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
