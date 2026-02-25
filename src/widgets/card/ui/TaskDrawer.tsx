import { useCallback, useEffect, useRef, useState } from 'react';
import { Drawer } from '@/shared/ui/Drawer';
import { TaskMetadata } from '@/widgets/card/ui/TaskMetadata';
import { TaskProperties } from '@/widgets/card/ui/TaskProperties';
import { TaskComment } from '@/widgets/card/ui/TaskComment';
import { mockUsers, type AssigneeOption } from '@/app/store/mock';
import { useAppDispatch } from '@/shared/lib/hooks/redux';
import {
  updateTaskTitle,
  updateTaskAssignee,
  updateTaskStatus,
  updateTaskComments,
} from '@/app/store/slices/tasksSlice';
import type { StatusOption } from '@/app/store/statusOptions';

import styles from './TaskDrawer.module.scss';
import type { TaskDto } from '@/shared/api/types/task.dto';


interface TaskDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  taskNumber: string;
  task: TaskDto;
  columnAlias: string;
}

const DRAWER_CLOSE_DURATION = 350;

export function TaskDrawer({
  isOpen,
  onClose,
  taskNumber,
  task,
  columnAlias,
}: TaskDrawerProps) {
  const dispatch = useAppDispatch();
  const taskId = String(task.id);
  const [isClosing, setIsClosing] = useState(false);
  const [localValue, setLocalValue] = useState<string | null>(null);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const value = localValue ?? task.title;

  const handleClose = useCallback(() => {
    if (isClosing) return;
    setIsClosing(true);
    timeoutRef.current = setTimeout(() => {
      setLocalValue(null);
      onClose();
    }, DRAWER_CLOSE_DURATION);
  }, [isClosing, onClose]);

  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  const handleBlur = () => {
    const trimmed = value.trim();
    if (trimmed !== task.title) {
      dispatch(updateTaskTitle({ columnAlias, taskId, newTitle: trimmed }));
    }
    setLocalValue(null);
  };

  const onAssigneeChange = (assigneeOption: AssigneeOption) => {
    dispatch(
      updateTaskAssignee({
        columnAlias,
        taskId,
        assignee: {
          id: String(assigneeOption.id),
          name: assigneeOption.name,
          src: assigneeOption.src ?? '',
        },
      })
    );
  };

  const onStatusChange = (statusOption: StatusOption) => {
    dispatch(
      updateTaskStatus({
        columnAlias,
        taskId,
        status: {
          id: statusOption.id,
          label: statusOption.label,
          variant: statusOption.variant,
        },
      })
    );
  };

  const onTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setLocalValue(value);
    dispatch(updateTaskTitle({ columnAlias, taskId, newTitle: value }));
  };


  const onCommentsChange = (comments: string) => {
    dispatch(updateTaskComments({ columnAlias, taskId, comments }));
  };

  return (
    <Drawer isOpen={isOpen && !isClosing} onClose={handleClose} title={taskNumber}>
      <div className={styles.content}>
        <div className={styles.section}>
          <div className={styles.label}>Описание</div>
          <div className={styles.titleInputWrapper}>
            <span className={styles.pinIcon}>📍</span>
            <input
              type="text"
              className={styles.titleInput}
              value={value}
              onChange={onTitleChange}
              onBlur={handleBlur}
              placeholder="New task"
            />
          </div>
        </div>
        <div className={styles.section}>
          <TaskMetadata taskNumber={taskNumber} />
        </div>
        <div className={styles.section}>
          <div className={styles.propertiesHeader}>Properties</div>
          <TaskProperties
            assignee={task.assignee as AssigneeOption}
            users={mockUsers}
            onAssigneeChange={onAssigneeChange}
            status={task.status}
            onStatusChange={onStatusChange}
          />
        </div>
        <div className={styles.section}>
          <div className={styles.propertiesHeader}>Comments</div>
          <TaskComment
            text={task.comments ?? ''}
            onSave={onCommentsChange}
            placeholder="Add a comment..."
          />
        </div>
      </div>
    </Drawer>
  );
}
