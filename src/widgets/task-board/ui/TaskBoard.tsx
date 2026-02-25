import type { TaskDto } from '@/shared/api/types/task.dto';
import { Column } from '@/widgets/column/ui/Column';
import { TaskDrawer } from '@/widgets/card/ui/TaskDrawer';
import { useAppDispatch, useAppSelector } from '@/shared/lib/hooks/redux';
import { selectStatusObjects } from '@/app/store/selectors/statusSelectors';
import { setActiveTask } from '@/app/store/slices/tasksSlice';
import {
  selectFilteredBoardData,
  selectActiveTaskInfo,
} from '@/app/store/selectors/boardSelectors';
import styles from '@/widgets/task-board/ui/TaskBoard.module.css';
import { HeaderBoard } from '@/widgets/headerBoard/ui/HeaderBoard';

export function TaskBoard() {
  const dispatch = useAppDispatch();
  const boardData = useAppSelector(selectFilteredBoardData);
  const activeTaskInfo = useAppSelector(selectActiveTaskInfo);
  const statusObjects = useAppSelector(selectStatusObjects);

  return (
    <div>
      <div className={styles.title}>Rec: Tasks</div>
      <HeaderBoard />
      <div className={`${styles.board} flex`}>
        {boardData.map((column) => (
          <Column
            key={column.alias}
            variant={statusObjects[column.status]?.variant ?? statusObjects[column.alias]?.variant ?? 'ghost'}
            column={column}
          />
        ))}
      </div>

      {activeTaskInfo && (
        <TaskDrawer
          isOpen
          onClose={() => dispatch(setActiveTask(null))}
          taskNumber={`REC-${activeTaskInfo.task.id}`}
          task={activeTaskInfo.task as unknown as TaskDto}
          columnAlias={activeTaskInfo.columnAlias}
        />
      )}
    </div>
  );
}
