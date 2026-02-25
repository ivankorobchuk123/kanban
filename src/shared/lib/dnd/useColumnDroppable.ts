import { useEffect } from 'react'

import { dropTargetForElements } from '@atlaskit/pragmatic-drag-and-drop/element/adapter'

export function useColumnDroppable(
  elementRef: React.RefObject<HTMLElement | null>,
  columnAlias: string,
  onDrop: (params: { taskId: string; fromColumnAlias: string; toColumnAlias: string }) => void
) {
  useEffect(() => {
    const el = elementRef.current
    if (!el) return

    return dropTargetForElements({
      element: el,
      canDrop: ({ source }) => {
        const data = source.data as { type?: string; columnAlias?: string }
        return data.type === 'task' && data.columnAlias !== columnAlias
      },
      onDrop: ({ source }) => {
        const data = source.data as { type?: string; taskId?: string; columnAlias?: string }
        if (data.taskId && data.columnAlias && data.columnAlias !== columnAlias) {
          onDrop({
            taskId: String(data.taskId),
            fromColumnAlias: data.columnAlias,
            toColumnAlias: columnAlias,
          })
        }
      },
    })
  }, [elementRef, columnAlias, onDrop])
}
