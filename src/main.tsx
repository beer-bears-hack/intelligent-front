import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'

import { App } from '@app/index'

if (import.meta.env.DEV && import.meta.env.VITE_ENABLE_MOCKS === 'true') {
  const { worker } = await import('@shared/mocks/browser') // eslint-disable-line import/no-internal-modules
  await worker.start({ onUnhandledRequest: 'bypass' })
}

createRoot(document.querySelector('#root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
