import { type ReactNode } from 'react'

import { ConfirmProvider } from '@/shared/ui/ConfirmDialog'
import { I18nProvider } from './I18nProvider'
import { StoreProvider } from './StoreProvider'

interface AppProvidersProps {
  children: ReactNode
}

export function AppProviders({ children }: AppProvidersProps) {
  return (
    <StoreProvider>
      <ConfirmProvider>
        <I18nProvider>{children}</I18nProvider>
      </ConfirmProvider>
    </StoreProvider>
  )
}
