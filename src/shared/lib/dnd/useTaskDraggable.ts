import { useEffect } from 'react'

import { draggable } from '@atlaskit/pragmatic-drag-and-drop/element/adapter'

export function useTaskDraggable(
  elementRef: React.RefObject<HTMLElement | null>,
  dragHandleRef: React.RefObject<HTMLElement | null>,
  taskId: string,
  columnAlias: string,
  selectedTaskIds: string[] = []
) {
  useEffect(() => {
    const el = elementRef.current
    const handle = dragHandleRef.current ?? el
    if (!el) return

    const isPartOfSelection = selectedTaskIds.includes(taskId)
    const draggedIds =
      isPartOfSelection && selectedTaskIds.length > 1 ? selectedTaskIds : [taskId]

    return draggable({
      element: el,
      dragHandle: handle ?? undefined,
      getInitialData: () => ({
        taskId,
        columnAlias,
        type: 'task',
        selectedTaskIds: draggedIds,
      }),
      onGenerateDragPreview:
        draggedIds.length > 1
          ? ({ nativeSetDragImage }) => {
              if (!nativeSetDragImage) return;
              const preview = document.createElement('div');
              preview.style.cssText = [
                'position:fixed',
                'top:-9999px',
                'left:-9999px',
                'background:#1e293b',
                'color:white',
                'border-radius:6px',
                'padding:6px 12px',
                'font-size:13px',
                'font-weight:500',
                'font-family:sans-serif',
                'white-space:nowrap',
              ].join(';');
              preview.textContent = `${draggedIds.length} tasks`;
              document.body.appendChild(preview);
              nativeSetDragImage(preview, preview.offsetWidth / 2, preview.offsetHeight / 2);
              return () => {
                if (document.body.contains(preview)) {
                  document.body.removeChild(preview);
                }
              };
            }
          : undefined,
    })
  }, [elementRef, dragHandleRef, taskId, columnAlias, selectedTaskIds])
}
