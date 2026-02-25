import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import { mockUsers } from '@/app/store/mock';
import { STATUS_OBJECTS } from '@/app/store/statusOptions';

const initialState = {
  activeTaskId: null as string | null,
  tasks: [
    {
      alias: 'new',
      title: 'New',
      status: STATUS_OBJECTS['new'].id,
      children: [
        {
          title: 'Обновить дизайн поп-апа на подписку',
          comments: 'Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industrys standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ips',
          assignee: mockUsers[0],
          status: STATUS_OBJECTS['new'],
          id: 1,
        },
        {
          title: 'Обновить дизайн поп-апа на подписку 2',
          comments: '',
          assignee: mockUsers[1],
          status: STATUS_OBJECTS['new'],
          id: 2,
        },
      ],
    },
    {
      alias: 'in-progress',
      title: 'In Progress',
      status: STATUS_OBJECTS['in-progress'].id,
      children: [
        {
          title: 'BE - Migrate to AWS S3',
          comments: '',
          assignee: mockUsers[2],
          status: STATUS_OBJECTS['in-progress'],
          id: 3,
        },
      ],
    },
    {
      alias: 'need-test',
      title: 'Need Test',
      status: STATUS_OBJECTS['need-test'].id,
      children: [],
    },
    {
      alias: 'backlog',
      title: 'Backlog',
      status: STATUS_OBJECTS['backlog'].id,
      children: [],
    },
  ],
};

const columnsSlice = createSlice({
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
      const { columnAlias, taskId, newTitle } = action.payload;

      const column = state.tasks.find((item) => item.alias === columnAlias);

      if (!column?.children) return;

      const task = column.children.find(
        (item) => String(item.id) === String(taskId)
      );
      if (task) task.title = newTitle;
    },

    removeTask: (
      state,
      action: PayloadAction<{ columnAlias: string; taskId: string }>
    ) => {
      const { columnAlias, taskId } = action.payload;

      const column = state.tasks.find((item) => item.alias === columnAlias);

      if (!column?.children) return;

      if (state.activeTaskId === taskId) {
        state.activeTaskId = null;
      }

      column.children = column.children.filter(
        (item) => String(item.id) !== String(taskId)
      );
    },

    addTask: (
      state,
      action: PayloadAction<{ columnAlias: string; title?: string }>
    ) => {
      const { columnAlias, title = 'New task' } = action.payload;

      const column = state.tasks.find((item) => item.alias === columnAlias);

      if (!column?.children) return;

      const maxId = state.tasks.reduce((max, col) => {
        const ids = (col.children ?? []).map((t: { id?: number }) => t.id ?? 0);
        return Math.max(max, ...ids, 0);
      }, 0);

      column.children.push({
        id: maxId + 1,
        title,
        comments: '',
        assignee: mockUsers[0],
        status: STATUS_OBJECTS[columnAlias as keyof typeof STATUS_OBJECTS],
      });
    },

    updateTaskStatus: (
      state,
      action: PayloadAction<{
        columnAlias: string;
        taskId: string;
        status: { id: string; label: string; variant: import('@/app/store/types').TaskVariant };
      }>
    ) => {
      const { columnAlias, taskId, status } = action.payload;

      const sourceColumn = state.tasks.find((item) => item.alias === columnAlias);
      if (!sourceColumn?.children) return;

      const taskIndex = sourceColumn.children.findIndex(
        (item) => String(item.id) === String(taskId)
      );
      if (taskIndex === -1) return;

      const [task] = sourceColumn.children.splice(taskIndex, 1);
      task.status = {
        id: status.id,
        label: status.label,
        variant: status.variant,
      };

      const targetColumn = state.tasks.find((item) => item.alias === status.id);
      if (targetColumn?.children) {
        targetColumn.children.push(task);
      } else {
        sourceColumn.children.splice(taskIndex, 0, task);
      }
    },

    setActiveTask: (state, action: PayloadAction<string | null>) => {
      state.activeTaskId = action.payload;
    },

    updateTaskComments: (
      state,
      action: PayloadAction<{
        columnAlias: string;
        taskId: string;
        comments: string;
      }>
    ) => {
      const { columnAlias, taskId, comments } = action.payload;
      const column = state.tasks.find((item) => item.alias === columnAlias);
      if (!column?.children) return;
      const task = column.children.find(
        (item) => String(item.id) === String(taskId)
      );
      if (task) task.comments = comments;
    },

    updateTaskAssignee: (
      state,
      action: PayloadAction<{
        columnAlias: string;
        taskId: string;
        assignee: { id: string; name: string; src?: string; avatarSrc?: string };
      }>
    ) => {
      const { columnAlias, taskId, assignee } = action.payload;

      const column = state.tasks.find((item) => item.alias === columnAlias);

      if (!column?.children) return;

      const task = column.children.find(
        (item) => String(item.id) === String(taskId)
      );

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
  addTask,
  updateTaskAssignee,
  updateTaskStatus,
  updateTaskComments,
  setActiveTask,
} = columnsSlice.actions;
export default columnsSlice.reducer;
