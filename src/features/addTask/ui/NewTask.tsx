import { useAppDispatch } from '@/shared/lib/hooks/redux';
import { addTaskThunk } from '@/app/store/slices/tasksSlice';

import styles from './NewTask.module.scss';

interface NewTaskProps {
  color?: string;
  columnAlias: string;
}

export function NewTask({ color, columnAlias }: NewTaskProps) {
  const dispatch = useAppDispatch();

  const handleAddTask = () => {
    dispatch(addTaskThunk({ columnAlias }));
  };

  return (
    <button
      className={`${styles.newTask} flex items-center gap-2`}
      style={{ backgroundColor: color ? `color-mix(in srgb, ${color} 10%, white)` : undefined }}
      onClick={handleAddTask}
    >
      <i className="material-icons-outlined">add</i> New Task
    </button>
  );
}

