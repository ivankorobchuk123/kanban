import { useState, useRef } from 'react';
import { useAppDispatch, useAppSelector } from '@/shared/lib/hooks/redux';
import {
  removeTasks,
  clearTaskSelection,
  toggleTasksComplete,
  moveTasksToColumn,
} from '@/app/store/slices/tasksSlice';
import { useConfirm } from '@/shared/ui/ConfirmDialog';
import { StatusSelectDropdown } from '@/shared/ui/StatusSelectDropdown';
import type { StatusOption } from '@/app/store/statusOptions';
import type { TaskVariant } from '@/app/store/types';
import { selectColumns } from '@/app/store/selectors/boardSelectors';
import { selectStatusObjects } from '@/app/store/selectors/statusSelectors';
import { selectSelectedTaskIds } from '@/app/store/selectors/boardSelectors';
import { selectFilteredBoardData } from '@/app/store/selectors/boardSelectors';

import styles from './SelectionBar.module.scss';

export function SelectionBar() {
  const dispatch = useAppDispatch();
  const confirm = useConfirm();
  const selectedIds = useAppSelector(selectSelectedTaskIds);
  const boardData = useAppSelector(selectFilteredBoardData);
  const columns = useAppSelector(selectColumns);
  const statusObjects = useAppSelector(selectStatusObjects);
  const [isStatusOpen, setIsStatusOpen] = useState(false);
  const statusAnchorRef = useRef<HTMLButtonElement>(null);

  const tasks = boardData.flatMap((col) => col.tasks);
  const selectedTasks = tasks.filter((t) => selectedIds.includes(String(t.id)));
  const completedCount = selectedTasks.filter(
    (t) => (t as { completed?: boolean }).completed
  ).length;
  const hasCompleted = completedCount > 0;

  const columnOptions: Array<{
    id: string;
    label: string;
    variant: TaskVariant;
    color: string;
  }> = columns.map((col) => {
    const status = statusObjects[col.alias] ?? statusObjects[col.status];
    return {
      id: col.alias,
      label: col.title,
      variant: (status?.variant ?? 'ghost') as TaskVariant,
      color: col.color ?? status?.color ?? '#94a3b8',
    };
  });

  const statusGroups = [{ label: '', options: columnOptions }];

  const handleDelete = async () => {
    const ok = await confirm({
      title: 'Delete tasks?',
      message: `Are you sure you want to delete ${selectedIds.length} tasks?`,
      confirmText: 'Delete',
      cancelText: 'Cancel',
    });
    if (ok) {
      const payload = selectedTasks.map((t) => ({
        taskId: String(t.id),
        columnAlias: t.columnAlias,
      }));
      dispatch(removeTasks(payload));
    }
  };

  const handleStatusSelect = (option: StatusOption) => {
    const status = statusObjects[option.id] ?? {
      id: option.id,
      label: option.label,
      variant: option.variant as StatusOption['variant'],
      color: option.color,
    };
    dispatch(
      moveTasksToColumn({
        taskIds: selectedIds,
        toColumnAlias: option.id,
        status: {
          id: status.id,
          label: status.label,
          variant: status.variant,
          color: status.color,
        },
      })
    );
    setIsStatusOpen(false);
  };

  const handleMarkIncomplete = () => {
    dispatch(toggleTasksComplete(selectedIds));
  };

  if (selectedIds.length === 0) return null;

  return (
    <div className={styles.bar}>
      <div className={styles.content}>
        <span className={styles.count}>
          Selected: {selectedIds.length}
        </span>
        <button
          type="button"
          className={styles.closeButton}
          onClick={() => dispatch(clearTaskSelection())}
          aria-label="Clear selection"
        >
          <span className="material-icons-outlined">close</span>
        </button>
        <div className={styles.actions}>
          <div className={styles.statusWrapper}>
            <button
              ref={statusAnchorRef}
              type="button"
              className={styles.actionButton}
              onClick={() => setIsStatusOpen(!isStatusOpen)}
            >
              <span className="material-icons-outlined">label</span>
              Change status
            </button>
            <StatusSelectDropdown
              isOpen={isStatusOpen}
              onClose={() => setIsStatusOpen(false)}
              groups={statusGroups}
              onSelect={handleStatusSelect}
              anchorRef={statusAnchorRef}
            />
          </div>
          {hasCompleted && (
            <button
              type="button"
              className={styles.actionButton}
              onClick={handleMarkIncomplete}
            >
              <span className="material-icons-outlined">radio_button_unchecked</span>
              Incomplete
            </button>
          )}
          <button
            type="button"
            className={`${styles.actionButton} ${styles.deleteButton}`}
            onClick={handleDelete}
          >
            <span className="material-icons-outlined">delete</span>
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}
