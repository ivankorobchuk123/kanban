import { type ReactNode, Suspense } from 'react'

import '@/shared/config/i18n'

interface I18nProviderProps {
  children: ReactNode
}

export function I18nProvider({ children }: I18nProviderProps) {
  return <Suspense fallback={null}>{children}</Suspense>
}
