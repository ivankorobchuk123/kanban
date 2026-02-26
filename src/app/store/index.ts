import { combineReducers, configureStore } from '@reduxjs/toolkit'
import { persistStore, persistReducer } from 'redux-persist'
import storage from 'redux-persist/lib/storage'

import columnsReducer from './slices/columnsSlice'
import tasksReducer from './slices/tasksSlice'
import statusOptionsReducer from './slices/statusOptionsSlice'
import filterReducer from './slices/filterSlice'
import searchReducer from './slices/searchSlice'
import selectionReducer from './slices/selectionSlice'

const rootReducer = combineReducers({
  columns: columnsReducer,
  tasks: tasksReducer,
  statusOptions: statusOptionsReducer,
  filter: filterReducer,
  search: searchReducer,
  selection: selectionReducer,
})

const persistConfig = {
  key: 'rec-man',
  storage,
}

const persistedReducer = persistReducer(persistConfig, rootReducer)

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST', 'persist/REHYDRATE'],
      },
    }),
})

export const persistor = persistStore(store)

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
