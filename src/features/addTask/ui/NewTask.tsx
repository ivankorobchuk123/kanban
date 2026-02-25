import { useAppDispatch } from '@/shared/lib/hooks/redux';
import { addTask } from '@/app/store/slices/tasksSlice';

import styles from './NewTask.module.scss';

interface NewTaskProps {
  className?: string;
  columnAlias: string;
}

export function NewTask({ className = '', columnAlias }: NewTaskProps) {
  const dispatch = useAppDispatch();

  const handleAddTask = () => {
    dispatch(addTask({ columnAlias }));
  };

  return (
    <button
      className={`${styles.newTask} flex items-center gap-2 ${styles[className]}`}
      onClick={handleAddTask}
    >
      <i className="material-icons-outlined">add</i> New Task
    </button>
  );
}
