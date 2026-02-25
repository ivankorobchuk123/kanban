import { useState, useCallback } from 'react';
import { useAppDispatch, useAppSelector } from '@/shared/lib/hooks/redux';
import { addColumn } from '@/app/store/slices/columnsSlice';
import { addStatusOption } from '@/app/store/slices/statusOptionsSlice';
import {
  setSearchQuery,
  addTaskStartAndOpenThunk,
} from '@/app/store/slices/tasksSlice';
import { selectStatusObjects } from '@/app/store/selectors/statusSelectors';
import { AddColumnPopup } from '@/features/addColumn';
import { TaskVariant } from '@/app/store/types';

import styles from './HeaderBoard.module.scss';

const NEW_COLUMN_ALIAS = 'new';

export function HeaderBoard() {
  const dispatch = useAppDispatch();
  const searchQuery = useAppSelector((state) => state.tasks.searchQuery);
  const columns = useAppSelector((state) => state.columns.columns);
  const statusObjects = useAppSelector(selectStatusObjects);

  const [isAddColumnOpen, setIsAddColumnOpen] = useState(false);

  const handleNewTask = () => {
    const hasColumn = columns.some((col) => col.alias === NEW_COLUMN_ALIAS);

    if (!hasColumn) {
      const status = statusObjects[NEW_COLUMN_ALIAS];
      if (status) {
        dispatch(
          addColumn({
            alias: NEW_COLUMN_ALIAS,
            title: status.label,
            status: NEW_COLUMN_ALIAS,
            color: status.color,
          })
        );
      }
    }
    dispatch(addTaskStartAndOpenThunk({}));
  };

  const handleAddColumnSubmit = useCallback(
    (title: string, color: string) => {
      const alias = `column-${Date.now()}`;

      dispatch(
        addColumn({
          alias,
          title,
          status: 'new',
          color,
        })
      );
      dispatch(
        addStatusOption({
          id: alias,
          label: title,
          variant: TaskVariant.GHOST,
          color,
        })
      );
    },
    [dispatch]
  );

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
      <div className={styles.actions}>
        <button
          type="button"
          className={styles.addColumnButton}
          onClick={() => setIsAddColumnOpen(true)}
        >
          <span className="material-icons-outlined">add</span>
          Add column
        </button>
        <button
          type="button"
          className={styles.newButton}
          onClick={handleNewTask}
        >
          <span className="material-icons-outlined">add</span>
          New
        </button>
      </div>
      <AddColumnPopup
        isOpen={isAddColumnOpen}
        onClose={() => setIsAddColumnOpen(false)}
        onSubmit={handleAddColumnSubmit}
      />
    </div>
  );
}
