import { type ReactNode } from 'react'

import { I18nProvider } from './I18nProvider'
import { StoreProvider } from './StoreProvider'

interface AppProvidersProps {
  children: ReactNode
}

export function AppProviders({ children }: AppProvidersProps) {
  return (
    <StoreProvider>
      <I18nProvider>{children}</I18nProvider>
    </StoreProvider>
  )
}
