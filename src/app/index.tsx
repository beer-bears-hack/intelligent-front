import './index.css'
import { AntConfigProvider } from './providers/AntConfigProvider'
import { QueryProvider } from './providers/QueryProvider'
import { RouterProvider } from './providers/RouterProvider'

export function App() {
  return (
    <AntConfigProvider>
      <QueryProvider>
        <RouterProvider />
      </QueryProvider>
    </AntConfigProvider>
  )
}
