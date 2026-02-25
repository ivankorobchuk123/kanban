import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { TaskFilter } from '@/app/store/types';

const initialState = 'all' as TaskFilter;

const filterSlice = createSlice({
  name: 'filter',
  initialState,
  reducers: {
    setFilter: (_, action: PayloadAction<TaskFilter>) => action.payload,
  },
});

export const { setFilter } = filterSlice.actions;
export default filterSlice.reducer;
