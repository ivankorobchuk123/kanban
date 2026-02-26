import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import { mockColumns } from '@/app/store/mock';
import type { ColumnDto } from '@/app/store/mock';

const initialState = {
  columns: mockColumns,
};

const columnsSlice = createSlice({
  name: 'columns',
  initialState,
  reducers: {
    addColumn: (
      state,
      action: PayloadAction<{ alias: string; title: string; status: string; color: string }>
    ) => {
      const { alias, title, status, color } = action.payload;

      if (state.columns.some((col) => col.alias === alias)) return;
      const minOrder =
        state.columns.length > 0
          ? Math.min(...state.columns.map((col) => col.order), 0)
          : 0;
      state.columns.unshift({
        alias,
        title,
        status,
        color,
        tasks: [],
        order: minOrder - 1,
      } as ColumnDto);
    },

    deleteColumn: (state, action: PayloadAction<{ columnAlias: string }>) => {
      const { columnAlias } = action.payload;
      state.columns = state.columns.filter((col) => col.alias !== columnAlias);
    },

    updateColumn: (
      state,
      action: PayloadAction<{ columnAlias: string; title?: string; color?: string }>
    ) => {
      const { columnAlias, title, color } = action.payload;
      const col = state.columns.find((c) => c.alias === columnAlias);
      if (col) {
        if (title !== undefined) col.title = title;
        if (color !== undefined) col.color = color;
      }
    },

    reorderColumn: (
      state,
      action: PayloadAction<{ columnAlias: string; targetColumnAlias: string }>
    ) => {
      const { columnAlias, targetColumnAlias } = action.payload;
      if (columnAlias === targetColumnAlias) return;

      const sorted = [...state.columns].sort((a, b) => a.order - b.order);
      const fromIdx = sorted.findIndex((c) => c.alias === columnAlias);
      const toIdx = sorted.findIndex((c) => c.alias === targetColumnAlias);
      if (fromIdx < 0 || toIdx < 0) return;

      const [removed] = sorted.splice(fromIdx, 1);
      sorted.splice(toIdx, 0, removed);

      sorted.forEach((col, i) => {
        col.order = i;
      });
    },
  },
});

export const { addColumn, deleteColumn, updateColumn, reorderColumn } = columnsSlice.actions;
export default columnsSlice.reducer;
