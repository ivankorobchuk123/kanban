import styles from '@/widgets/task-board/ui/TaskBoard.module.css';
import { Column } from '@/widgets/column/ui/Column';
import { useAppSelector } from '@/shared/lib/hooks/redux';
import type { TaskDto } from '@/shared/api/types/task.dto';
import { STATUS_OBJECTS } from '@/app/store/statusOptions';

export function TaskBoard() {
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
                    variant={STATUS_OBJECTS[task.status].variant}
                    tasks={task.children as unknown as TaskDto[]}
                    title={task.title}
                />
            ))
        }

    </div>
    </div>
  );
}
