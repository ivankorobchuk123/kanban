import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

const searchSlice = createSlice({
  name: 'search',
  initialState: '',
  reducers: {
    setSearch: (_, action: PayloadAction<string>) => action.payload,
  },
});

export const { setSearch } = searchSlice.actions;
export default searchSlice.reducer;
