import { useAppDispatch, useAppSelector } from '@/shared/lib/hooks/redux';
import { addColumn } from '@/app/store/slices/columnsSlice';
import { setSearchQuery, addTaskStartAndOpen } from '@/app/store/slices/tasksSlice';
import { STATUS_OBJECTS } from '@/app/store/statusOptions';

import styles from './HeaderBoard.module.scss';

const NEW_COLUMN_ALIAS = 'new';

export function HeaderBoard() {
  const dispatch = useAppDispatch();
  const searchQuery = useAppSelector((state) => state.tasks.searchQuery);
  const columns = useAppSelector((state) => state.columns.columns);

  const handleNewTask = () => {
    const hasColumn = columns.some((col) => col.alias === NEW_COLUMN_ALIAS);
    if (!hasColumn) {
      const status = STATUS_OBJECTS[NEW_COLUMN_ALIAS];
      dispatch(
        addColumn({
          alias: NEW_COLUMN_ALIAS,
          title: status?.label ?? 'New',
          status: NEW_COLUMN_ALIAS,
        })
      );
    }
    dispatch(addTaskStartAndOpen({}));
  };

  return (
    <div className={`${styles.header} flex items-center justify-between`}>
      <div className={styles.searchWrapper}>
        <span className={`${styles.searchIcon} material-icons-outlined`}>
          search
        </span>
        <input
          type="text"
          className={styles.searchInput}
          placeholder="Search tasks..."
          value={searchQuery}
          onChange={(e) => dispatch(setSearchQuery(e.target.value))}
        />
      </div>
      <button
        type="button"
        className={styles.newButton}
        onClick={handleNewTask}
      >
        <span className="material-icons-outlined">add</span>
        New
      </button>
    </div>
  );
}