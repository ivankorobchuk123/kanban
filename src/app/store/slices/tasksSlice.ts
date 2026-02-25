import { createSlice, type PayloadAction } from '@reduxjs/toolkit'

import type { TaskDto } from '@/shared/api/types/task.dto';


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
    addTask: (state, action: PayloadAction<TaskDto>) => {
      console.log(action.payload)
    },
  },
})

export const {
    addTask,
} = columnsSlice.actions
export default columnsSlice.reducer
