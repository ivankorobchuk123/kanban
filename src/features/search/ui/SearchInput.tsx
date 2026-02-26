
import { useTranslation } from 'react-i18next'

import { Input } from '@/shared/ui/Input'
import { useAppDispatch, useAppSelector } from '@/shared/lib/hooks/redux'
import { setSearch } from '@/app/store/slices/searchSlice'

import styles from './SearchInput.module.css'

export function SearchInput() {
  const { t } = useTranslation()
  const dispatch = useAppDispatch()
  const search = useAppSelector((s) => s.search)

  return (
    <div className={styles.wrapper}>
      <Input
        placeholder={t('search.placeholder')}
        value={search}
        onChange={(e) => dispatch(setSearch(e.target.value))}
        className={styles.input}
        type="search"
        aria-label={t('search.placeholder')}
      />
    </div>
  )
}
