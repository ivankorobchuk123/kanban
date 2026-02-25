import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import { mockUsers } from '@/app/store/mock';

const initialState = {
  isActiveCard: null,
  tasks: [
    {
      alias: 'new',
      title: 'New',
      variant: 'ghost',
      children: [
        {
          title: 'Обновить дизайн поп-апа на подписку',
          comments: 'Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industrys standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ips',
          assignee: mockUsers[0],
          id: 1,
        },
        {
          title: 'Обновить дизайн поп-апа на подписку 2',
          comments: '',
          assignee: mockUsers[1],
          id: 2,
        },
      ],
    },
    {
      alias: 'in-progress',
      title: 'In Progress',
      variant: 'secondary',
      children: [
        {
          title: 'BE - Migrate to AWS S3',
          comments: '',
          assignee: mockUsers[2],
          id: 3,
        },
      ],
    },
    {
      alias: 'test',
      title: 'Need Test',
      variant: 'primary',
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
        assignee: mockUsers[0],
      });
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
} = columnsSlice.actions;
export default columnsSlice.reducer;
