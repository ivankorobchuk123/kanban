import type { RootState } from '../index';

export const selectColumns = (state: RootState) =>
  state.columns.columns.slice().sort((a, b) => a.order - b.order);

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

export const selectFilteredBoardData = (state: RootState) => {
  const columns = selectColumns(state);
  const tasks = selectTasks(state);
  const query = state.tasks.searchQuery.trim().toLowerCase();

  if (!query) {
    return columns.map((col) => ({
      ...col,
      tasks: tasks
        .filter((item) => item.columnAlias === col.alias)
        .sort((a, b) => a.order - b.order),
    }));
  }

  return columns.map((col) => ({
    ...col,
    tasks: tasks
      .filter((item) => item.columnAlias === col.alias)
      .filter(
        (item) =>
          (item.title ?? '').toLowerCase().includes(query) ||
          (item.comments ?? '').toLowerCase().includes(query)
      )
      .sort((a, b) => a.order - b.order),
  }));
};

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
