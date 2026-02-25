import { useState } from 'react';
import { Drawer } from '@/shared/ui/Drawer';
import { TaskMetadata } from '@/widgets/card/ui/TaskMetadata';
import { TaskProperties } from '@/widgets/card/ui/TaskProperties';
import { mockUsers, type AssigneeOption } from '@/app/store/mock';
import { useAppDispatch } from '@/shared/lib/hooks/redux';
import { updateTaskTitle, updateTaskAssignee } from '@/app/store/slices/tasksSlice';

import styles from './TaskDrawer.module.scss';
import type { TaskDto } from '@/shared/api/types/task.dto';


interface TaskDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  taskNumber: string;
  task: TaskDto;
  columnAlias: string;
}

export function TaskDrawer({
  isOpen,
  onClose,
  taskNumber,
  task,
  columnAlias,
}: TaskDrawerProps) {
  const dispatch = useAppDispatch();
  const taskId = String(task.id);

  const [localValue, setLocalValue] = useState<string | null>(null);

  const value = localValue ?? task.title;

  const handleBlur = () => {
    const trimmed = value.trim();
    if (trimmed !== task.title) {
      dispatch(updateTaskTitle({ columnAlias, taskId, newTitle: trimmed }));
    }
    setLocalValue(null);
  };

  const handleClose = () => {
    setLocalValue(null);
    onClose();
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

  const onTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setLocalValue(value);
    dispatch(updateTaskTitle({ columnAlias, taskId, newTitle: value }));
  };

  return (
    <Drawer isOpen={isOpen} onClose={handleClose} title={taskNumber}>
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
            assignee={task.assignee}
            users={mockUsers}
            onAssigneeChange={onAssigneeChange}
          />
        </div>
      </div>
    </Drawer>
  );
}
