
import styles from '@/widgets/task-board/ui/TaskBoard.module.css';
import { Column } from '@/widgets/column/ui/Column';
import { useAppDispatch, useAppSelector } from '@/shared/lib/hooks/redux';
import { updateTaskTitle } from '@/app/store/slices/tasksSlice';
import type { TaskDto } from '@/shared/api/types/task.dto';
import type { TaskVariant } from '@/app/store/types';

export function TaskBoard() {
  const dispatch = useAppDispatch();
  const tasks = useAppSelector((state) => state.tasks.tasks);

  return (
    <div>
        <div className={styles.title}>Rac: Tasks</div>
        <div className={`${styles.board} flex`}>
        {
            tasks.map((task) => (
                <Column
                    key={task.alias}
                    columnAlias={task.alias}
                    variant={task.variant as TaskVariant}
                    tasks={task.children as unknown as TaskDto[]}
                    title={task.title}
                    onTaskTitleChange={(columnAlias, taskId, newTitle) => {
                        dispatch(updateTaskTitle({ columnAlias, taskId, newTitle }));
                    }}
                />
            ))
        }

    </div>
    </div>
  );
}
