import type { TaskDto } from '@/shared/api/types/task.dto';
import { Column } from '@/widgets/column/ui/Column';
import { TaskDrawer } from '@/widgets/card/ui/TaskDrawer';
import { STATUS_OBJECTS } from '@/app/store/statusOptions';
import { setActiveTask } from '@/app/store/slices/tasksSlice';
import {
  selectFilteredBoardData,
  selectActiveTaskInfo,
} from '@/app/store/selectors/boardSelectors';
import styles from '@/widgets/task-board/ui/TaskBoard.module.css';
import { HeaderBoard } from '@/widgets/headerBoard/ui/HeaderBoard';
import { useAppSelector, useAppDispatch } from '@/shared/lib/hooks/redux';

export function TaskBoard() {
  const dispatch = useAppDispatch();
  const boardData = useAppSelector(selectFilteredBoardData);
  const activeTaskInfo = useAppSelector(selectActiveTaskInfo);

  return (
    <div>
      <div className={styles.title}>Rec: Tasks</div>
      <HeaderBoard />
      <div className={`${styles.board} flex`}>
        {boardData.map((column) => (
          <Column
            key={column.alias}
            columnAlias={column.alias}
            variant={STATUS_OBJECTS[column.status]?.variant ?? 'ghost'}
            tasks={column.tasks as unknown as TaskDto[]}
            title={column.title}
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
