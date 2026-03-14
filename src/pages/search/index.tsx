import { useMutation } from '@tanstack/react-query'
import { App } from 'antd'
import { useState } from 'react'

import { SearchResultsTable } from '@widgets/search-results'

import { SearchForm } from '@features/search-ste'

import { searchSte } from '@entities/ste'
import type { SteItem, SearchRequest } from '@entities/ste'

import { getErrorMessage } from '@shared/lib/get-error-message'
import { PageContainer } from '@shared/ui/page-container'

export default function SearchPage() {
  const { notification } = App.useApp()
  const [results, setResults] = useState<SteItem[]>([])

  const mutation = useMutation({
    mutationFn: searchSte,
    onSuccess: (data) => setResults(data.results),
    onError: (error) => {
      notification.error({
        message: 'Ошибка поиска',
        description: getErrorMessage(error, 'Не удалось выполнить поиск. Попробуйте позже.'),
        duration: 5,
      })
    },
  })

  return (
    <PageContainer
      title="Поиск СТЕ"
      tooltip="Найдите аналогичные товары и услуги для обоснования начальной цены контракта"
    >
      <SearchForm
        onSearch={(values: SearchRequest) => mutation.mutate(values)}
        loading={mutation.isPending}
      />
      <SearchResultsTable data={results} loading={mutation.isPending} />
    </PageContainer>
  )
}
