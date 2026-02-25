/**
 * Task card entity - displays a single task with checkbox, text, and actions.
 * Supports inline editing and selection.
 */
import { useState, useRef, useEffect } from 'react'
import { useTranslation } from 'react-i18next'

import { Checkbox } from '@/shared/ui/Checkbox'
import { Button } from '@/shared/ui/Button'
import { useAppDispatch } from '@/shared/lib/hooks/redux'
import { toggleTaskComplete, updateTaskText, removeTaskById } from '@/app/store/slices/tasksSlice'
import { toggleTaskSelection } from '@/app/store/slices/selectionSlice'
import { getHighlightRanges } from '@/shared/lib/search/fuzzyMatch'

import type { Task } from '@/app/store/types'

import styles from './TaskCard.module.css'

const DATA_ATTRIBUTE = 'data-task-id'
const DATA_COLUMN_ATTRIBUTE = 'data-column-id'

interface TaskCardProps {
  task: Task
  searchQuery: string
  isSelected: boolean
  dragHandleRef?: React.RefObject<HTMLDivElement | null>
}

export function TaskCard({ task, searchQuery, isSelected, dragHandleRef }: TaskCardProps) {
  const { t } = useTranslation()
  const dispatch = useAppDispatch()
  const [isEditing, setIsEditing] = useState(false)
  const [editValue, setEditValue] = useState(task.text)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus()
      inputRef.current.select()
    }
  }, [isEditing])

  const handleToggleComplete = () => {
    dispatch(toggleTaskComplete(task.id))
  }

  const handleToggleSelect = () => {
    dispatch(toggleTaskSelection(task.id))
  }

  const handleStartEdit = () => {
    setEditValue(task.text)
    setIsEditing(true)
  }

  const handleSaveEdit = () => {
    if (editValue.trim() && editValue !== task.text) {
      dispatch(updateTaskText({ id: task.id, text: editValue }))
    } else {
      setEditValue(task.text)
    }
    setIsEditing(false)
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSaveEdit()
    }
    if (e.key === 'Escape') {
      setEditValue(task.text)
      setIsEditing(false)
    }
  }

  const handleDelete = () => {
    dispatch(removeTaskById(String(task.id)))
  }

  const renderText = () => {
    if (isEditing) {
      return (
        <input
          ref={inputRef}
          type="text"
          value={editValue}
          onChange={(e) => setEditValue(e.target.value)}
          onBlur={handleSaveEdit}
          onKeyDown={handleKeyDown}
          className={styles.editInput}
          data-task-id={task.id}
          data-column-id={task.columnId}
        />
      )
    }

    if (searchQuery.trim()) {
      const ranges = getHighlightRanges(task.text, searchQuery)
      if (ranges.length > 0) {
        const parts: React.ReactNode[] = []
        let lastEnd = 0
        ranges.forEach(([start, end]) => {
          if (start > lastEnd) {
            parts.push(<span key={`${lastEnd}-${start}`}>{task.text.slice(lastEnd, start)}</span>)
          }
          parts.push(
            <mark key={`${start}-${end}`} className={styles.highlight}>
              {task.text.slice(start, end)}
            </mark>
          )
          lastEnd = end
        })
        if (lastEnd < task.text.length) {
          parts.push(<span key={lastEnd}>{task.text.slice(lastEnd)}</span>)
        }
        return <span onDoubleClick={handleStartEdit}>{parts}</span>
      }
    }

    return <span onDoubleClick={handleStartEdit}>{task.text}</span>
  }

  return (
    <div
      className={`${styles.card} ${task.completed ? styles.completed : ''} ${isSelected ? styles.selected : ''}`}
      data-task-id={task.id}
      data-column-id={task.columnId}
    >
      <div ref={dragHandleRef} className={styles.dragHandle} aria-hidden>
        ⋮⋮
      </div>
      <div className={styles.content}>
        <Checkbox
          checked={task.completed}
          onChange={handleToggleComplete}
          aria-label={task.completed ? t('task.incomplete') : t('task.completed')}
        />
        <Checkbox
          checked={isSelected}
          onChange={handleToggleSelect}
          className={styles.selectCheckbox}
          aria-label={t('bulk.clearSelection')}
        />
        <div className={styles.text}>{renderText()}</div>
      </div>
      <div className={styles.actions}>
        <Button variant="ghost" className={styles.actionBtn} onClick={handleStartEdit} aria-label={t('task.edit')}>
          ✎
        </Button>
        <Button variant="ghost" className={styles.actionBtn} onClick={handleDelete} aria-label={t('task.delete')}>
          ×
        </Button>
      </div>
    </div>
  )
}

export { DATA_ATTRIBUTE, DATA_COLUMN_ATTRIBUTE }
