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

export type ArchiveStatus = 'completed' | 'canceled';

interface ArchivedTask {
  task: (typeof mockTasks)[number];
  archiveStatus: ArchiveStatus;
}

const initialState = {
  tasks: mockTasks,
  activeTaskId: null as string | null,
  searchQuery: '',
  statusFilterIds: null as string[] | null,
  selectedTaskIds: [] as string[],
  archivedTasks: [] as ArchivedTask[],
  showCompleted: false,
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

      if (task) {
        task.title = newTitle;
      }
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
      state.selectedTaskIds = state.selectedTaskIds.filter(
        (id) => id !== taskId
      );
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
          .filter((item) => item.columnAlias === toColumnAlias)
          .sort((a, b) => a.order - b.order);

        const currentIndex = tasksInColumn.findIndex(
          (item) => String(item.id) === String(taskId)
        );

        if (currentIndex === -1 || currentIndex === targetIndex) return;

        const reordered = [...tasksInColumn];
        const [removed] = reordered.splice(currentIndex, 1);

        reordered.splice(targetIndex, 0, removed);

        reordered.forEach((item, index) => {
          item.order = index;
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

    toggleTaskSelection: (state, action: PayloadAction<string>) => {
      const id = action.payload;
      const idx = state.selectedTaskIds.indexOf(id);
      if (idx >= 0) {
        state.selectedTaskIds.splice(idx, 1);
      } else {
        state.selectedTaskIds.push(id);
      }
    },

    selectTasks: (state, action: PayloadAction<string[]>) => {
      state.selectedTaskIds = action.payload;
    },

    clearTaskSelection: (state) => {
      state.selectedTaskIds = [];
    },

    removeTasks: (
      state,
      action: PayloadAction<Array<{ taskId: string; columnAlias: string }>>
    ) => {
      const ids = new Set(action.payload.map((p) => p.taskId));

      state.tasks = state.tasks.filter((t) => !ids.has(String(t.id)));

      state.selectedTaskIds = state.selectedTaskIds.filter(
        (id) => !ids.has(id)
      );
      if (state.activeTaskId && ids.has(state.activeTaskId)) {
        state.activeTaskId = null;
      }
    },

    toggleTasksComplete: (state, action: PayloadAction<string[]>) => {
      const ids = new Set(action.payload);

      state.tasks.forEach((task) => {
        if (ids.has(String(task.id)) && 'completed' in task) {
          (task as { completed?: boolean }).completed = !(
            task as { completed?: boolean }
          ).completed;
        }
      });
    },

    archiveTasks: (
      state,
      action: PayloadAction<{
        taskIds: string[];
        archiveStatus: ArchiveStatus;
      }>
    ) => {
      const { taskIds, archiveStatus } = action.payload;

      const idSet = new Set(taskIds);

      const tasksToArchive = state.tasks.filter((t) => idSet.has(String(t.id)));

      if (tasksToArchive.length === 0) {
        return;
      }

      tasksToArchive.forEach((task) => {
        state.archivedTasks.push({ task: { ...task }, archiveStatus });
      });
      state.tasks = state.tasks.filter((t) => !idSet.has(String(t.id)));
      state.selectedTaskIds = state.selectedTaskIds.filter(
        (id) => !idSet.has(id)
      );
      if (state.activeTaskId && idSet.has(state.activeTaskId)) {
        state.activeTaskId = null;
      }
    },

    moveMultipleTasksToIndex: (
      state,
      action: PayloadAction<{
        taskIds: string[];
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
      const { taskIds, toColumnAlias, targetIndex, status } = action.payload;
      const idSet = new Set(taskIds);

      state.tasks.forEach((task) => {
        if (idSet.has(String(task.id))) {
          task.columnAlias = toColumnAlias;
          task.status = { ...status };
        }
      });

      const allInTarget = state.tasks
        .filter((item) => item.columnAlias === toColumnAlias)
        .sort((a, b) => a.order - b.order);

      const movedTasks = allInTarget.filter((item) =>
        idSet.has(String(item.id))
      );
      const otherTasks = allInTarget.filter(
        (item) => !idSet.has(String(item.id))
      );

      const insertAt = Math.min(targetIndex, otherTasks.length);
      otherTasks.splice(insertAt, 0, ...movedTasks);
      otherTasks.forEach((item, index) => {
        item.order = index;
      });

      state.selectedTaskIds = [];
    },

    moveTasksToColumn: (
      state,
      action: PayloadAction<{
        taskIds: string[];
        toColumnAlias: string;
        status: {
          id: string;
          label: string;
          variant: TaskVariant;
          color: string;
        };
      }>
    ) => {
      const { taskIds, toColumnAlias, status } = action.payload;

      const idSet = new Set(taskIds);

      const tasksToMove = state.tasks.filter((item) =>
        idSet.has(String(item.id))
      );

      if (tasksToMove.length === 0) {
        return;
      }

      tasksToMove.forEach((task) => {
        task.columnAlias = toColumnAlias;
        task.status = {
          id: status.id,
          label: status.label,
          variant: status.variant,
          color: status.color,
        };
      });

      const allInTarget = state.tasks
        .filter((item) => item.columnAlias === toColumnAlias)
        .sort((a, b) => a.order - b.order);

      allInTarget.forEach((item, index) => {
        item.order = index;
      });
      state.selectedTaskIds = [];
    },

    toggleShowCompleted: (state) => {
      state.showCompleted = !state.showCompleted;
    },

    setSearchQuery: (state, action: PayloadAction<string>) => {
      state.searchQuery = action.payload;
    },

    setStatusFilter: (state, action: PayloadAction<string[] | null>) => {
      state.statusFilterIds = action.payload;
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
      state.tasks = state.tasks.filter(
        (item) => String(item.id) !== String(taskId)
      );
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
      state.tasks = state.tasks.filter(
        (item) => item.columnAlias !== columnAlias
      );
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
  removeTasks,
  archiveTasks,
  toggleTaskComplete,
  toggleTasksComplete,
  updateTaskText,
  addTask,
  addTaskEndAndOpen,
  addTaskStartAndOpen,
  updateTaskAssignee,
  updateTaskStatus,
  moveTask,
  moveMultipleTasksToIndex,
  moveTasksToColumn,
  updateTaskComments,
  removeTasksByColumn,
  setActiveTask,
  setSearchQuery,
  setStatusFilter,
  toggleTaskSelection,
  selectTasks,
  clearTaskSelection,
  toggleShowCompleted,
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
