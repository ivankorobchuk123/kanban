import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import { mockColumns } from '@/app/store/mock';

const initialState = {
  columns: mockColumns,
};

const columnsSlice = createSlice({
  name: 'columns',
  initialState,
  reducers: {
    deleteColumn: (state, action: PayloadAction<{ columnAlias: string }>) => {
      const { columnAlias } = action.payload;
      state.columns = state.columns.filter((col) => col.alias !== columnAlias);
    },
  },
});

export const { deleteColumn } = columnsSlice.actions;
export default columnsSlice.reducer;
