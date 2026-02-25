import { useAppDispatch, useAppSelector } from '@/shared/lib/hooks/redux';
import { setSearchQuery, addTaskStartAndOpen } from '@/app/store/slices/tasksSlice';

import styles from './HeaderBoard.module.scss';

export function HeaderBoard() {
  const dispatch = useAppDispatch();
  const searchQuery = useAppSelector((state) => state.tasks.searchQuery);

  const handleNewTask = () => {
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