import { useRef, useCallback } from 'react';
import { Card } from '@/widgets/card/ui/Card';
import { Badge } from '@/shared/ui/Badge';
import type { TaskVariant } from '@/app/store/types';
import { NewTask } from '@/features/addTask/ui/NewTask';
import { useConfirm } from '@/shared/ui/ConfirmDialog';
import { useAppDispatch, useAppSelector } from '@/shared/lib/hooks/redux';
import { deleteColumn, reorderColumn } from '@/app/store/slices/columnsSlice';
import { removeStatusOption } from '@/app/store/slices/statusOptionsSlice';
import { removeTasksByColumn, moveTask } from '@/app/store/slices/tasksSlice';
import { useColumnDraggable } from '@/shared/lib/dnd/useColumnDraggable';
import { useColumnDropTarget } from '@/shared/lib/dnd/useColumnDropTarget';
import { useTaskDropTarget } from '@/shared/lib/dnd/useTaskDropTarget';
import { selectStatusObjects } from '@/app/store/selectors/statusSelectors';

import styles from './Column.module.scss';
import type { ColumnDto } from '@/app/store/mock';

interface ColumnProps {
  column: ColumnDto;
  variant: TaskVariant;
}

export function Column({ column, variant }: ColumnProps) {
  const confirm = useConfirm();
  const dispatch = useAppDispatch();
  const statusObjects = useAppSelector(selectStatusObjects);
  const columnRef = useRef<HTMLDivElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<HTMLDivElement>(null);

  useColumnDraggable(columnRef, headerRef, column.alias);
  useColumnDropTarget(columnRef, column.alias, (params) => dispatch(reorderColumn(params)));

  const handleTaskDrop = useCallback(
    ({
      taskId,
      fromColumnAlias,
      toColumnAlias,
      targetIndex,
    }: {
      taskId: string;
      fromColumnAlias: string;
      toColumnAlias: string;
      targetIndex: number;
    }) => {
      const statusOption = statusObjects[column.status] ?? statusObjects[column.alias];
      if (statusOption) {
        dispatch(
          moveTask({
            taskId,
            fromColumnAlias,
            toColumnAlias,
            targetIndex,
            status: statusOption,
          })
        );
      }
    },
    [dispatch, column.status, column.alias, statusObjects]
  );
  useTaskDropTarget(cardsRef, column.alias, column.tasks.length, handleTaskDrop, {
    useClosestEdge: false,
    enabled: column.tasks.length === 0,
  });

  const handleDeleteColumn = async () => {
    const ok = await confirm({
      title: 'Remove column?',
      message: 'Are you sure you want to remove this column?',
      confirmText: 'Remove',
      cancelText: 'Cancel',
    });
    if (ok) {
      dispatch(deleteColumn({ columnAlias: column.alias }));
      dispatch(removeTasksByColumn({ columnAlias: column.alias }));
      if (column.alias.startsWith('column-')) {
        dispatch(removeStatusOption(column.alias));
      }
    }
  };
  return (
    <div ref={columnRef} className={`${styles.column}`} style={{ backgroundColor: column.color ? `color-mix(in srgb, ${column.color} 30%, white)` : undefined }}>
      <div ref={headerRef} className={`${styles.wrapBadge} flex items-center justify-between ${styles.columnDragHandle}`}>
        <div className="flex items-center">
          <Badge variant={variant} color={column.color}>{column.title}</Badge>
          <span className={styles.count} style={{ color: column.color ? `color-mix(in srgb, ${column.color} 70%, black)` : undefined }}>{column.tasks.length}</span>
        </div>
        <div className="flex items-center">
          <button className={styles.icon} onClick={handleDeleteColumn}>
            <span className="material-icons-outlined">delete</span>
          </button>
        </div>
      </div>
      <div ref={cardsRef} className={styles.cards}>
        {column.tasks.map((card, index) => (
          <Card
            key={card.id}
            card={card}
            title={card.title}
            taskNumber={`REC-${card.id}`}
            columnAlias={column.alias}
            dropTargetIndex={index}
            onTaskDrop={handleTaskDrop}
          />
        ))}
      </div>
      <NewTask color={column.color}  columnAlias={column.alias} />
    </div>
  );
}
