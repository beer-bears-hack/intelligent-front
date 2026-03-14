import './index.css'
import { AntConfigProvider } from './providers/ant-config-provider'
import { QueryProvider } from './providers/query-provider'
import { RouterProvider } from './providers/router-provider'
import { SessionProvider } from './providers/session-provider'

export function App() {
  return (
    <AntConfigProvider>
      <QueryProvider>
        <SessionProvider>
          <RouterProvider />
        </SessionProvider>
      </QueryProvider>
    </AntConfigProvider>
  )
}
