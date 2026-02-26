import { createSelector } from '@reduxjs/toolkit';
import type { RootState } from '../index';
import type { ColumnDto, TaskEntity } from '@/app/store/mock';

export type BoardColumn = Omit<ColumnDto, 'tasks'> & {
  tasks: TaskEntity[];
  completedTasks: TaskEntity[];
};

export const selectColumns = createSelector(
  [(state: RootState) => state.columns.columns],
  (columns) => columns.slice().sort((a, b) => a.order - b.order)
);

export const selectTasks = (state: RootState) => state.tasks.tasks;

export const selectSearchQuery = (state: RootState) => state.tasks.searchQuery;

export const selectActiveTaskId = (state: RootState) =>
  state.tasks.activeTaskId;

export const selectSelectedTaskIds = (state: RootState) =>
  state.tasks.selectedTaskIds;

export const selectArchivedTasks = (state: RootState) =>
  state.tasks.archivedTasks;

export const selectTasksByColumn = (state: RootState, columnAlias: string) =>
  state.tasks.tasks
    .filter((item) => item.columnAlias === columnAlias)
    .sort((a, b) => a.order - b.order);

export const selectBoardData = (state: RootState) => {
  const columns = selectColumns(state);
  const tasks = selectTasks(state);
  return columns.map((column) => ({
    ...column,
    tasks: tasks
      .filter((item) => item.columnAlias === column.alias)
      .sort((a, b) => a.order - b.order),
  }));
};

export const selectShowCompleted = (state: RootState) => state.tasks.showCompleted;

export const selectFilteredBoardData = createSelector(
  [
    selectColumns,
    selectTasks,
    (state: RootState) => state.tasks.searchQuery,
    (state: RootState) => state.tasks.statusFilterIds,
    (state: RootState) => state.tasks.showCompleted,
    selectArchivedTasks,
  ],
  (columns, tasks, searchQuery, statusFilterIds, showCompleted, archivedTasks): BoardColumn[] => {
    let filteredColumns = columns;

    if (statusFilterIds !== null) {
      if (statusFilterIds.length > 0) {
        const filterSet = new Set(statusFilterIds);
        filteredColumns = columns.filter((col) => filterSet.has(col.alias));
      } else {
        filteredColumns = [];
      }
    }

    const query = searchQuery.trim().toLowerCase();

    return filteredColumns.map((col) => {
      const regularTasks = tasks
        .filter((item) => item.columnAlias === col.alias)
        .filter(
          (item) =>
            !query ||
            (item.title ?? '').toLowerCase().includes(query) ||
            (item.comments ?? '').toLowerCase().includes(query)
        )
        .sort((a, b) => a.order - b.order);

      const completedTasks = showCompleted
        ? archivedTasks
            .filter((at) => at.archiveStatus === 'completed' && at.task.columnAlias === col.alias)
            .map((at) => at.task as TaskEntity)
        : [];

      return { ...col, tasks: regularTasks, completedTasks };
    });
  }
);

export const selectActiveTaskInfo = (state: RootState) => {
  const activeTaskId = state.tasks.activeTaskId;
  if (!activeTaskId) {
    return null
  };
  const task = state.tasks.tasks.find(
    (item) => String(item.id) === String(activeTaskId)
  );
  if (!task) {
    return null;
  }
  return {
    task,
    columnAlias: task.columnAlias,
  };
};
