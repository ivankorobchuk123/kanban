import styles from '@/widgets/task-board/ui/TaskBoard.module.css';
import { Column } from '@/widgets/column/ui/Column';
import { TaskDrawer } from '@/widgets/card/ui/TaskDrawer';
import { useAppSelector, useAppDispatch } from '@/shared/lib/hooks/redux';
import { setActiveTask } from '@/app/store/slices/tasksSlice';
import type { TaskDto } from '@/shared/api/types/task.dto';
import { STATUS_OBJECTS } from '@/app/store/statusOptions';

export function TaskBoard() {
  const tasks = useAppSelector((state) => state.tasks.tasks);
  const activeTaskId = useAppSelector((state) => state.tasks.activeTaskId);
  const dispatch = useAppDispatch();

  const activeTaskInfo = activeTaskId
    ? (() => {
        for (const column of tasks) {
          const task = (column.children ?? []).find(
            (t) => String(t.id) === activeTaskId
          );
          if (task) {
            return {
              task: task as unknown as TaskDto,
              columnAlias: column.alias,
            };
          }
        }
        return null;
      })()
    : null;

  return (
    <div>
      <div className={styles.title}>Rec: Tasks</div>
      <div className={`${styles.board} flex`}>
        {tasks.map((task) => (
          <Column
            key={task.alias}
            columnAlias={task.alias}
            variant={STATUS_OBJECTS[task.status].variant}
            tasks={task.children as unknown as TaskDto[]}
            title={task.title}
          />
        ))}
      </div>

      {activeTaskInfo && (
        <TaskDrawer
          isOpen
          onClose={() => dispatch(setActiveTask(null))}
          taskNumber={`REC-${activeTaskInfo.task.id}`}
          task={activeTaskInfo.task}
          columnAlias={activeTaskInfo.columnAlias}
        />
      )}
    </div>
  );
}
