import { useEffect } from 'react'
import {
  attachClosestEdge,
  extractClosestEdge,
} from '@atlaskit/pragmatic-drag-and-drop-hitbox/closest-edge'
import { dropTargetForElements } from '@atlaskit/pragmatic-drag-and-drop/element/adapter'

export type ColumnEdge = 'left' | 'right'

export function useColumnDropTarget(
  elementRef: React.RefObject<HTMLElement | null>,
  columnAlias: string,
  onDrop: (params: { columnAlias: string; targetColumnAlias: string }) => void,
  onEdgeChange?: (edge: ColumnEdge | null) => void
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
      getData: ({ input, element }) => {
        const data = { type: 'column', columnAlias }
        return attachClosestEdge(data, {
          input,
          element,
          allowedEdges: ['left', 'right'],
        }) as Record<string, unknown>
      },
      onDragEnter: ({ self }) => {
        onEdgeChange?.(extractClosestEdge(self.data) as ColumnEdge | null)
      },
      onDrag: ({ self }) => {
        onEdgeChange?.(extractClosestEdge(self.data) as ColumnEdge | null)
      },
      onDragLeave: () => {
        onEdgeChange?.(null)
      },
      onDrop: ({ source }) => {
        onEdgeChange?.(null)
        const data = source.data as { type?: string; columnAlias?: string }
        if (data.type === 'column' && data.columnAlias && data.columnAlias !== columnAlias) {
          onDrop({
            columnAlias: data.columnAlias,
            targetColumnAlias: columnAlias,
          })
        }
      },
    })
  }, [elementRef, columnAlias, onDrop, onEdgeChange])
}
