import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import { mockTasks } from '@/app/store/mock';
import {
  createNewTask,
  findTaskById,
  getNextTaskId,
} from './tasksSlice.helpers';

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
      state.tasks = state.tasks.filter((t) => String(t.id) !== String(taskId));
      if (state.activeTaskId === taskId) {
        state.activeTaskId = null;
      }
    },

    addTask: (
      state,
      action: PayloadAction<{ columnAlias: string; title?: string }>
    ) => {
      const { columnAlias, title = 'New task' } = action.payload;
      const tasksInColumn = state.tasks.filter(
        (t) => t.columnAlias === columnAlias
      );
      const maxOrder =
        tasksInColumn.length > 0
          ? Math.max(...tasksInColumn.map((t) => t.order), -1)
          : -1;
      const newId = getNextTaskId(state.tasks);
      state.tasks.push(
        createNewTask({
          id: newId,
          title,
          columnAlias,
          order: maxOrder + 1,
        })
      );
    },

    addTaskEndAndOpen: (
      state,
      action: PayloadAction<{ columnAlias?: string; title?: string }>
    ) => {
      const columnAlias = action.payload.columnAlias ?? 'new';
      const title = action.payload.title ?? 'New task';

      const tasksInColumn = state.tasks.filter(
        (t) => t.columnAlias === columnAlias
      );
      const maxOrder =
        tasksInColumn.length > 0
          ? Math.max(...tasksInColumn.map((t) => t.order), -1)
          : -1;
      const newId = getNextTaskId(state.tasks);
      state.tasks.push(
        createNewTask({
          id: newId,
          title,
          columnAlias,
          order: maxOrder + 1,
        })
      );
      state.activeTaskId = String(newId);
    },

    addTaskStartAndOpen: (
      state,
      action: PayloadAction<{ columnAlias?: string; title?: string }>
    ) => {
      const columnAlias = action.payload.columnAlias ?? 'new';
      const title = action.payload.title ?? 'New task';

      const tasksInColumn = state.tasks.filter(
        (t) => t.columnAlias === columnAlias
      );
      const minOrder =
        tasksInColumn.length > 0
          ? Math.min(...tasksInColumn.map((t) => t.order), 0)
          : 0;
      const newId = getNextTaskId(state.tasks);
      state.tasks.unshift(
        createNewTask({
          id: newId,
          title,
          columnAlias,
          order: minOrder - 1,
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
          variant: import('@/app/store/types').TaskVariant;
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
        };
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
      if (task) task.comments = comments;
    },

    removeTaskById: (state, action: PayloadAction<string>) => {
      const taskId = action.payload;
      state.tasks = state.tasks.filter((t) => String(t.id) !== String(taskId));
      if (state.activeTaskId === taskId) state.activeTaskId = null;
    },

    toggleTaskComplete: (state, action: PayloadAction<string>) => {
      const task = findTaskById(state.tasks, action.payload);
      if (task && 'completed' in task) {
        (task as { completed?: boolean }).completed = !(task as { completed?: boolean }).completed;
      }
    },

    updateTaskText: (
      state,
      action: PayloadAction<{ id: string; text: string }>
    ) => {
      const task = findTaskById(state.tasks, action.payload.id);
      if (task) (task as { title?: string }).title = action.payload.text;
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
      state.tasks = state.tasks.filter((t) => t.columnAlias !== columnAlias);
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
          avatarSrc?: string;
        };
      }>
    ) => {
      const { taskId, assignee } = action.payload;
      const task = findTaskById(state.tasks, taskId);
      if (task) {
        task.assignee = {
          id: assignee.id,
          name: assignee.name,
          src: assignee.src ?? assignee.avatarSrc ?? '',
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
  updateTaskComments,
  removeTasksByColumn,
  setActiveTask,
  setSearchQuery,
} = tasksSlice.actions;
export default tasksSlice.reducer;
