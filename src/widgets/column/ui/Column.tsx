import { useRef, useCallback } from 'react';

import type { TaskDto } from '@/shared/api/types/task.dto';
import { Card } from '@/widgets/card/ui/Card';
import { Badge } from '@/shared/ui/Badge';
import type { TaskVariant } from '@/app/store/types';
import { NewTask } from '@/features/addTask/ui/NewTask';
import { useConfirm } from '@/shared/ui/ConfirmDialog';
import { useAppDispatch } from '@/shared/lib/hooks/redux';
import { deleteColumn, reorderColumn } from '@/app/store/slices/columnsSlice';
import { removeTasksByColumn, moveTask } from '@/app/store/slices/tasksSlice';
import { useColumnDroppable } from '@/shared/lib/dnd/useColumnDroppable';
import { useColumnDraggable } from '@/shared/lib/dnd/useColumnDraggable';
import { useColumnDropTarget } from '@/shared/lib/dnd/useColumnDropTarget';
import { STATUS_OBJECTS } from '@/app/store/statusOptions';

import styles from './Column.module.scss';

interface ColumnProps {
  columnAlias: string;
  columnStatus: string;
  tasks: TaskDto[];
  variant: TaskVariant;
  title: string;
}

export function Column({ columnAlias, columnStatus, tasks, variant, title }: ColumnProps) {
  const confirm = useConfirm();
  const dispatch = useAppDispatch();
  const columnRef = useRef<HTMLDivElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<HTMLDivElement>(null);

  useColumnDraggable(columnRef, headerRef, columnAlias);
  useColumnDropTarget(columnRef, columnAlias, (params) => dispatch(reorderColumn(params)));

  const handleTaskDrop = useCallback(
    ({ taskId, fromColumnAlias, toColumnAlias }: { taskId: string; fromColumnAlias: string; toColumnAlias: string }) => {
      const statusOption = STATUS_OBJECTS[columnStatus];
      if (statusOption) {
        dispatch(
          moveTask({
            taskId,
            fromColumnAlias,
            toColumnAlias,
            status: statusOption,
          })
        );
      }
    },
    [dispatch, columnStatus]
  );

  useColumnDroppable(cardsRef, columnAlias, handleTaskDrop);

  const handleDeleteColumn = async () => {
    const ok = await confirm({
      title: 'Remove column?',
      message: 'Are you sure you want to remove this column?',
      confirmText: 'Remove',
      cancelText: 'Cancel',
    });
    if (ok) {
      dispatch(deleteColumn({ columnAlias }));
      dispatch(removeTasksByColumn({ columnAlias }));
    }
  };
  return (
    <div ref={columnRef} className={`${styles.column} ${styles[variant]}`}>
      <div ref={headerRef} className={`${styles.wrapBadge} flex items-center justify-between ${styles.columnDragHandle}`}>
        <div className="flex items-center">
          <Badge variant={variant}>{title}</Badge>
          <span className={styles.count}>{tasks.length}</span>
        </div>
        <div className="flex items-center">
          <button className={styles.icon} onClick={handleDeleteColumn}>
            <span className="material-icons-outlined">delete</span>
          </button>
        </div>
      </div>
      <div ref={cardsRef} className={styles.cards}>
        {tasks.map((card) => (
          <Card
            key={card.id}
            card={card}
            title={card.title}
            taskNumber={`REC-${card.id}`}
            columnAlias={columnAlias}
          />
        ))}
      </div>
      <NewTask className={variant} columnAlias={columnAlias} />
    </div>
  );
}
