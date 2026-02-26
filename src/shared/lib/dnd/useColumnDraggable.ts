import { useEffect } from 'react'

import { draggable } from '@atlaskit/pragmatic-drag-and-drop/element/adapter'

export function useColumnDraggable(
  elementRef: React.RefObject<HTMLElement | null>,
  dragHandleRef: React.RefObject<HTMLElement | null>,
  columnAlias: string,
  onDragStateChange?: (isDragging: boolean) => void
) {
  useEffect(() => {
    const el = elementRef.current
    const handle = dragHandleRef.current ?? el
    if (!el) return

    return draggable({
      element: el,
      dragHandle: handle ?? undefined,
      getInitialData: () => ({
        columnAlias,
        type: 'column',
      }),
      onDragStart: () => onDragStateChange?.(true),
      onDrop: () => onDragStateChange?.(false),
    })
  }, [elementRef, dragHandleRef, columnAlias, onDragStateChange])
}
