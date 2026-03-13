import { useMutation } from '@tanstack/react-query'
import { Alert, App, Button } from 'antd'
import { useNavigate } from 'react-router'

import { GenerateDocForm } from '@features/generate-document'

import { generateDocument, downloadDocument } from '@entities/document'
import type { DocumentSettings } from '@entities/document'
import { useSessionStore } from '@entities/session'

import { downloadBlob } from '@shared/lib/download'
import { PageContainer } from '@shared/ui/PageContainer'

export default function DocumentPage() {
  const { notification } = App.useApp()
  const navigate = useNavigate()
  const sessionId = useSessionStore((s) => s.sessionId)

  const mutation = useMutation({
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
      })
    },
    onError: () => {
      notification.error({
        message: 'Ошибка',
        description: 'Не удалось сформировать документ. Попробуйте позже.',
      })
    },
  })

  const handleGenerate = (settings: DocumentSettings) => {
    mutation.mutate(settings)
  }

  return (
    <PageContainer title="Формирование документа">
      {sessionId ? (
        <div style={{ maxWidth: 600 }}>
          <GenerateDocForm onGenerate={handleGenerate} loading={mutation.isPending} />
          {mutation.isSuccess && (
            <Alert
              style={{ marginTop: 16 }}
              type="success"
              message="Документ успешно сформирован"
              description="Файл загружен автоматически."
              showIcon
            />
          )}
        </div>
      ) : (
        <Alert
          type="warning"
          message="Сессия не найдена"
          description="Добавьте позиции в корзину перед формированием документа."
          showIcon
          action={<Button onClick={() => navigate('/search')}>Перейти к поиску</Button>}
        />
      )}
    </PageContainer>
  )
}
