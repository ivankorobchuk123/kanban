import { createSlice, type PayloadAction } from '@reduxjs/toolkit'


const initialState = {
    tasks: [
        {
            alias: 'new',
            title: 'New',
            variant: 'ghost',
            children: [
                {
                    title: 'Обновить дизайн поп-апа на подписку',
                    id: 1,
                },
                {
                    title: 'Обновить дизайн поп-апа на подписку 2',
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
    ]
}

const columnsSlice = createSlice({
  name: 'tasks',
  initialState,
  reducers: {
    updateTaskTitle: (state, action: PayloadAction<{ columnAlias: string; taskId: string; newTitle: string }>) => {
      const { columnAlias, taskId, newTitle } = action.payload;
      const column = state.tasks.find((c) => c.alias === columnAlias);
      if (!column?.children) return;
      const task = column.children.find((t) => String(t.id) === String(taskId));
      if (task) task.title = newTitle;
    },
  },
})

export const {
    updateTaskTitle,
} = columnsSlice.actions
export default columnsSlice.reducer
