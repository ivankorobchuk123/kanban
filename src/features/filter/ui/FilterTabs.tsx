/**
 * Filter tabs feature - filter tasks by completion status.
 */
import { useTranslation } from 'react-i18next'

import { useAppDispatch, useAppSelector } from '@/shared/lib/hooks/redux'
import { setFilter } from '@/app/store/slices/filterSlice'
import type { TaskFilter } from '@/app/store/types'

import styles from './FilterTabs.module.css'

const FILTERS: TaskFilter[] = ['all', 'completed', 'incomplete']

export function FilterTabs() {
  const { t } = useTranslation()
  const dispatch = useAppDispatch()
  const currentFilter = useAppSelector((s) => s.filter)

  return (
    <div className={styles.wrapper} role="tablist" aria-label={t('filter.all')}>
      {FILTERS.map((filter) => (
        <button
          key={filter}
          type="button"
          role="tab"
          aria-selected={currentFilter === filter}
          className={`${styles.tab} ${currentFilter === filter ? styles.active : ''}`}
          onClick={() => dispatch(setFilter(filter))}
        >
          {t(`filter.${filter}`)}
        </button>
      ))}
    </div>
  )
}
