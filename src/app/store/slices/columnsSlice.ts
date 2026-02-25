import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import { mockColumns } from '@/app/store/mock';

const initialState = {
  columns: mockColumns,
};

const columnsSlice = createSlice({
  name: 'columns',
  initialState,
  reducers: {
    addColumn: (
      state,
      action: PayloadAction<{ alias: string; title: string; status: string }>
    ) => {
      const { alias, title, status } = action.payload;
      if (state.columns.some((col) => col.alias === alias)) return;
      const minOrder =
        state.columns.length > 0
          ? Math.min(...state.columns.map((col) => col.order), 0)
          : 0;
      state.columns.unshift({
        alias,
        title,
        status,
        order: minOrder - 1,
      });
    },

    deleteColumn: (state, action: PayloadAction<{ columnAlias: string }>) => {
      const { columnAlias } = action.payload;
      state.columns = state.columns.filter((col) => col.alias !== columnAlias);
    },
  },
});

export const { addColumn, deleteColumn } = columnsSlice.actions;
export default columnsSlice.reducer;
