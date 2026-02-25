import { useRef } from 'react'

import { TaskCard } from './TaskCard'
import { useTaskDraggable } from '@/shared/lib/dnd/useTaskDraggable'

import type { Task } from '@/app/store/types'

interface DraggableTaskCardProps {
  task: Task
  searchQuery: string
  isSelected: boolean
}

export function DraggableTaskCard({ task, searchQuery, isSelected }: DraggableTaskCardProps) {
  const cardRef = useRef<HTMLDivElement>(null)
  const dragHandleRef = useRef<HTMLDivElement>(null)

  useTaskDraggable(cardRef, dragHandleRef, task.id, task.columnId)

  return (
    <div ref={cardRef}>
      <TaskCard
        task={task}
        searchQuery={searchQuery}
        isSelected={isSelected}
        dragHandleRef={dragHandleRef}
      />
    </div>
  )
}
