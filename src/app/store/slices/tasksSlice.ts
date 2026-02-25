import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { AppDispatch, RootState } from '@/app/store';
import { mockTasks } from '@/app/store/mock';
import {
  createNewTask,
  findTaskById,
  getNextTaskId,
} from './tasksSlice.helpers';
import { selectStatusObjects } from '@/app/store/selectors/statusSelectors';
import type { StatusOption } from '@/app/store/statusOptions';
import type { TaskVariant } from '@/app/store/types';

const initialState = {
  tasks: mockTasks,
  activeTaskId: null as string | null,
  searchQuery: '',
};

const tasksSlice = createSlice({
  name: 'tasks',
  initialState,
  reducers: {
    updateTaskTitle: (
      state,
      action: PayloadAction<{
        columnAlias: string;
        taskId: string;
        newTitle: string;
      }>
    ) => {
      const { taskId, newTitle } = action.payload;
      const task = findTaskById(state.tasks, taskId);
      if (task) task.title = newTitle;
    },

    removeTask: (
      state,
      action: PayloadAction<{ columnAlias: string; taskId: string }>
    ) => {
      const { taskId } = action.payload;

      state.tasks = state.tasks.filter(
        (item) => String(item.id) !== String(taskId)
      );

      if (state.activeTaskId === taskId) {
        state.activeTaskId = null;
      }
    },

    addTask: (
      state,
      action: PayloadAction<{
        columnAlias: string;
        title?: string;
        status: StatusOption;
      }>
    ) => {
      const { columnAlias, title = 'New task', status } = action.payload;

      const tasksInColumn = state.tasks.filter(
        (item) => item.columnAlias === columnAlias
      );

      const maxOrder =
        tasksInColumn.length > 0
          ? Math.max(...tasksInColumn.map((item) => item.order), -1)
          : -1;

      const newId = getNextTaskId(state.tasks);

      state.tasks.push(
        createNewTask({
          id: newId,
          title,
          columnAlias,
          order: maxOrder + 1,
          status,
        })
      );
    },

    addTaskEndAndOpen: (
      state,
      action: PayloadAction<{
        columnAlias?: string;
        title?: string;
        status: StatusOption;
      }>
    ) => {
      const columnAlias = action.payload.columnAlias ?? 'new';
      const title = action.payload.title ?? 'New task';
      const status = action.payload.status;

      const tasksInColumn = state.tasks.filter(
        (item) => item.columnAlias === columnAlias
      );
      const maxOrder =
        tasksInColumn.length > 0
          ? Math.max(...tasksInColumn.map((item) => item.order), -1)
          : -1;
      const newId = getNextTaskId(state.tasks);

      state.tasks.push(
        createNewTask({
          id: newId,
          title,
          columnAlias,
          order: maxOrder + 1,
          status,
        })
      );
      state.activeTaskId = String(newId);
    },

    addTaskStartAndOpen: (
      state,
      action: PayloadAction<{
        columnAlias?: string;
        title?: string;
        status: StatusOption;
      }>
    ) => {
      const columnAlias = action.payload.columnAlias ?? 'new';
      const title = action.payload.title ?? 'New task';
      const status = action.payload.status;

      const tasksInColumn = state.tasks.filter(
        (item) => item.columnAlias === columnAlias
      );
      const minOrder =
        tasksInColumn.length > 0
          ? Math.min(...tasksInColumn.map((item) => item.order), 0)
          : 0;
      const newId = getNextTaskId(state.tasks);

      state.tasks.unshift(
        createNewTask({
          id: newId,
          title,
          columnAlias,
          order: minOrder - 1,
          status,
        })
      );
      state.activeTaskId = String(newId);
    },

    updateTaskStatus: (
      state,
      action: PayloadAction<{
        columnAlias: string;
        taskId: string;
        status: {
          id: string;
          label: string;
          variant: TaskVariant;
          color: string;
        };
      }>
    ) => {
      const { taskId, status } = action.payload;
      const task = findTaskById(state.tasks, taskId);
      if (task) {
        task.columnAlias = status.id;
        task.status = {
          id: status.id,
          label: status.label,
          variant: status.variant,
          color: status.color,
        };
      }
    },

    moveTask: (
      state,
      action: PayloadAction<{
        taskId: string;
        fromColumnAlias: string;
        toColumnAlias: string;
        targetIndex: number;
        status: {
          id: string;
          label: string;
          variant: TaskVariant;
          color: string;
        };
      }>
    ) => {
      const { taskId, toColumnAlias, targetIndex, status } = action.payload;
      const task = findTaskById(state.tasks, taskId);
      if (!task) return;

      const isSameColumn = task.columnAlias === toColumnAlias;
      if (isSameColumn) {
        const tasksInColumn = state.tasks
          .filter((t) => t.columnAlias === toColumnAlias)
          .sort((a, b) => a.order - b.order);

        const currentIndex = tasksInColumn.findIndex(
          (t) => String(t.id) === String(taskId)
        );

        if (currentIndex === -1 || currentIndex === targetIndex) return;

        const reordered = [...tasksInColumn];
        const [removed] = reordered.splice(currentIndex, 1);

        reordered.splice(targetIndex, 0, removed);
        reordered.forEach((t, i) => {
          t.order = i;
        });
      } else {
        task.columnAlias = toColumnAlias;
        task.status = {
          id: status.id,
          label: status.label,
          variant: status.variant,
          color: status.color,
        };
        const tasksInTargetColumn = state.tasks
          .filter((t) => t.columnAlias === toColumnAlias)
          .sort((a, b) => a.order - b.order);

        const tasksWithoutMoved = tasksInTargetColumn.filter(
          (t) => String(t.id) !== String(taskId)
        );
        const insertIndex = Math.min(targetIndex, tasksWithoutMoved.length);

        tasksWithoutMoved.splice(insertIndex, 0, task);
        tasksWithoutMoved.forEach((t, i) => {
          t.order = i;
        });
      }
    },

    setActiveTask: (state, action: PayloadAction<string | null>) => {
      state.activeTaskId = action.payload;
    },

    setSearchQuery: (state, action: PayloadAction<string>) => {
      state.searchQuery = action.payload;
    },

    updateTaskComments: (
      state,
      action: PayloadAction<{
        columnAlias: string;
        taskId: string;
        comments: string;
      }>
    ) => {
      const { taskId, comments } = action.payload;
      const task = findTaskById(state.tasks, taskId);

      if (task) {
        task.comments = comments;
      }
    },

    removeTaskById: (state, action: PayloadAction<string>) => {
      const taskId = action.payload;
      state.tasks = state.tasks.filter((item) => String(item.id) !== String(taskId));
      if (state.activeTaskId === taskId) {
        state.activeTaskId = null;
      }
    },

    toggleTaskComplete: (state, action: PayloadAction<string>) => {
      const task = findTaskById(state.tasks, action.payload);

      if (task && 'completed' in task) {
        (task as { completed?: boolean }).completed = !(
          task as { completed?: boolean }
        ).completed;
      }
    },

    updateTaskText: (
      state,
      action: PayloadAction<{ id: string; text: string }>
    ) => {
      const task = findTaskById(state.tasks, action.payload.id);
      if (task) {
        (task as { title?: string }).title = action.payload.text;
      }
    },

    removeTasksByColumn: (
      state,
      action: PayloadAction<{ columnAlias: string }>
    ) => {
      const { columnAlias } = action.payload;
      if (state.activeTaskId) {
        const activeTask = findTaskById(state.tasks, state.activeTaskId);
        if (activeTask?.columnAlias === columnAlias) {
          state.activeTaskId = null;
        }
      }
      state.tasks = state.tasks.filter((item) => item.columnAlias !== columnAlias);
    },

    updateTaskAssignee: (
      state,
      action: PayloadAction<{
        columnAlias: string;
        taskId: string;
        assignee: {
          id: string;
          name: string;
          src?: string;
        };
      }>
    ) => {
      const { taskId, assignee } = action.payload;
      const task = findTaskById(state.tasks, taskId);
      if (task) {
        task.assignee = {
          id: assignee.id,
          name: assignee.name,
          src: assignee.src ?? '',
        };
      }
    },
  },
});

export const {
  updateTaskTitle,
  removeTask,
  removeTaskById,
  toggleTaskComplete,
  updateTaskText,
  addTask,
  addTaskEndAndOpen,
  addTaskStartAndOpen,
  updateTaskAssignee,
  updateTaskStatus,
  moveTask,
  updateTaskComments,
  removeTasksByColumn,
  setActiveTask,
  setSearchQuery,
} = tasksSlice.actions;

export const addTaskThunk =
  (payload: { columnAlias: string; title?: string }) =>
  (dispatch: AppDispatch, getState: () => RootState) => {

    const status = selectStatusObjects(getState())[payload.columnAlias];
    if (status) {
        dispatch(addTask({ ...payload, status }));
    }
  };

export const addTaskStartAndOpenThunk =
  (payload?: { columnAlias?: string; title?: string }) =>
  (dispatch: AppDispatch, getState: () => RootState) => {
    const columnAlias = payload?.columnAlias ?? 'new';
    const status = selectStatusObjects(getState())[columnAlias];
    if (status) {
      dispatch(addTaskStartAndOpen({ ...payload, columnAlias, status }));
    }
  };

export const addTaskEndAndOpenThunk =
  (payload?: { columnAlias?: string; title?: string }) =>
  (dispatch: AppDispatch, getState: () => RootState) => {

    const columnAlias = payload?.columnAlias ?? 'new';
    const status = selectStatusObjects(getState())[columnAlias];
    if (status) {
      dispatch(addTaskEndAndOpen({ ...payload, columnAlias, status }));
    }
  };

export default tasksSlice.reducer;
