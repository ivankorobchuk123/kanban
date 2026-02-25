/**
 * Hook for making a task draggable using pragmatic-drag-and-drop.
 */
import { useEffect } from 'react'

import { draggable } from '@atlaskit/pragmatic-drag-and-drop/element/adapter'

export function useTaskDraggable(
  elementRef: React.RefObject<HTMLElement | null>,
  dragHandleRef: React.RefObject<HTMLElement | null>,
  taskId: string,
  columnId: string
) {
  useEffect(() => {
    const el = elementRef.current
    const handle = dragHandleRef.current ?? el
    if (!el) return

    return draggable({
      element: el,
      dragHandle: handle ?? undefined,
      getInitialData: () => ({
        taskId,
        columnId,
        type: 'task',
      }),
    })
  }, [elementRef, dragHandleRef, taskId, columnId])
}
