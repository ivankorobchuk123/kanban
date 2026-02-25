import { configureStore } from '@reduxjs/toolkit'

import columnsReducer from './slices/columnsSlice'
import tasksReducer from './slices/tasksSlice'
import statusOptionsReducer from './slices/statusOptionsSlice'
import filterReducer from './slices/filterSlice'
import searchReducer from './slices/searchSlice'
import selectionReducer from './slices/selectionSlice'

export const store = configureStore({
  reducer: {
    columns: columnsReducer,
    tasks: tasksReducer,
    statusOptions: statusOptionsReducer,
    filter: filterReducer,
    search: searchReducer,
    selection: selectionReducer,
  },
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
