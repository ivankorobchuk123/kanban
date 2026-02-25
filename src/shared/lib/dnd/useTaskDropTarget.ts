import { useEffect } from 'react';
import {
  attachClosestEdge,
  extractClosestEdge,
} from '@atlaskit/pragmatic-drag-and-drop-hitbox/closest-edge';
import { dropTargetForElements } from '@atlaskit/pragmatic-drag-and-drop/element/adapter';

export type TaskDropParams = {
  taskId: string;
  fromColumnAlias: string;
  toColumnAlias: string;
  targetIndex: number;
};

export type Edge = 'top' | 'right' | 'bottom' | 'left';

export function useTaskDropTarget(
  elementRef: React.RefObject<HTMLElement | null>,
  columnAlias: string,
  targetIndex: number,
  onDrop: (params: TaskDropParams) => void,
  options?: {
    onClosestEdgeChange?: (edge: Edge | null) => void;
    useClosestEdge?: boolean;
    excludeTaskId?: string;
    enabled?: boolean;
  }
) {
  const {
    onClosestEdgeChange,
    useClosestEdge = true,
    excludeTaskId,
    enabled = true,
  } = options ?? {};

  useEffect(() => {
    const el = elementRef.current;
    if (!el) return;

    const isOverSelf = (source: { data: Record<string, unknown> }) =>
      excludeTaskId && String(source.data.taskId) === String(excludeTaskId);

    return dropTargetForElements({
      element: el,

      canDrop: ({ source }) => {
        if (!enabled) return false;
        const data = source.data as {
          type?: string;
          columnAlias?: string;
          taskId?: string;
        };
        if (data.type !== 'task') return false;
        return true;
      },

      getIsSticky: () => true,

      getData: useClosestEdge
        ? ({ input, element }) => {
            const data = { type: 'task', columnAlias, targetIndex };
            return attachClosestEdge(data, {
              input,
              element,
              allowedEdges: ['top', 'bottom'],
            }) as Record<string, unknown> & {
              type: string;
              columnAlias: string;
              targetIndex: number;
            };
          }
        : () => ({ type: 'task', columnAlias, targetIndex }),

      onDragEnter:
        onClosestEdgeChange &&
        (useClosestEdge
          ? (args: {
              source: { data: Record<string, unknown> };
              self: { data: Record<string, unknown> };
            }) => {
              if (!isOverSelf(args.source)) {
                onClosestEdgeChange(extractClosestEdge(args.self.data));
              }
            }
          : () => onClosestEdgeChange('bottom')),
      onDrag:
        onClosestEdgeChange &&
        (useClosestEdge
          ? (args: {
              source: { data: Record<string, unknown> };
              self: { data: Record<string, unknown> };
            }) => {
              if (!isOverSelf(args.source)) {
                onClosestEdgeChange(extractClosestEdge(args.self.data));
              }
            }
          : () => onClosestEdgeChange('bottom')),

      onDragLeave: () => onClosestEdgeChange?.(null),

      onDrop: ({ source, self }) => {
        const data = source.data as {
          type?: string;
          taskId?: string;
          columnAlias?: string;
        };
        if (data.type !== 'task' || !data.taskId || !data.columnAlias) return;

        let finalIndex = targetIndex;

        if (useClosestEdge) {
          const edge = extractClosestEdge(self.data as Record<string, unknown>);
          finalIndex = edge === 'bottom' ? targetIndex + 1 : targetIndex;
        }

        onDrop({
          taskId: String(data.taskId),
          fromColumnAlias: data.columnAlias,
          toColumnAlias: columnAlias,
          targetIndex: finalIndex,
        });
        onClosestEdgeChange?.(null);
      },
    });
  }, [
    elementRef,
    columnAlias,
    targetIndex,
    onDrop,
    onClosestEdgeChange,
    useClosestEdge,
    excludeTaskId,
    enabled,
  ]);
}
