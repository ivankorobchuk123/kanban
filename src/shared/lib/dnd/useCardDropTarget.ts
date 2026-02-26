
import { useEffect } from 'react'

import { dropTargetForElements } from '@atlaskit/pragmatic-drag-and-drop/element/adapter'

export function useCardDropTarget(
  elementRef: React.RefObject<HTMLElement | null>,
  cardTaskId: string,
  onDragEnter: (params: { taskId: string; beforeTaskId: string }) => void
) {
  useEffect(() => {
    const el = elementRef.current
    if (!el) return

    return dropTargetForElements({
      element: el,
      canDrop: ({ source }) => {
        const data = source.data as { type?: string; taskId?: string }
        return !!(data.type === 'task' && data.taskId && data.taskId !== cardTaskId)
      },
      onDragEnter: ({ source }) => {
        const data = source.data as { type?: string; taskId?: string }
        if (data.type === 'task' && data.taskId && data.taskId !== cardTaskId) {
          onDragEnter({
            taskId: String(data.taskId),
            beforeTaskId: cardTaskId,
          })
        }
      },
    })
  }, [elementRef, cardTaskId, onDragEnter])
}
