import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

const selectionSlice = createSlice({
  name: 'selection',
  initialState: [] as string[],
  reducers: {
    toggleTaskSelection: (state, action: PayloadAction<string>) => {
      const id = action.payload;
      const idx = state.indexOf(id);
      if (idx >= 0) {
        state.splice(idx, 1);
      } else {
        state.push(id);
      }
    },
  },
});

export const { toggleTaskSelection } = selectionSlice.actions;
export default selectionSlice.reducer;
