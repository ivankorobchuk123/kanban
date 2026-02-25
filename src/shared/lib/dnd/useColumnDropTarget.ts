
import { useEffect } from 'react'
import { dropTargetForElements } from '@atlaskit/pragmatic-drag-and-drop/element/adapter'

export function useColumnDropTarget(
  elementRef: React.RefObject<HTMLElement | null>,
  columnAlias: string,
  onDrop: (params: { columnAlias: string; targetColumnAlias: string }) => void
) {
  useEffect(() => {
    const el = elementRef.current
    if (!el) return

    return dropTargetForElements({
      element: el,
      canDrop: ({ source }) => {
        const data = source.data as { type?: string; columnAlias?: string }
        return data.type === 'column' && data.columnAlias !== columnAlias
      },
      onDrop: ({ source }) => {
        const data = source.data as { type?: string; columnAlias?: string }
        if (data.type === 'column' && data.columnAlias && data.columnAlias !== columnAlias) {
          onDrop({
            columnAlias: data.columnAlias,
            targetColumnAlias: columnAlias,
          })
        }
      },
    })
  }, [elementRef, columnAlias, onDrop])
}
