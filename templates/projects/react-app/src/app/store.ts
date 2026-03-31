import { configureStore } from '@reduxjs/toolkit';
import { exampleApi } from '../features/example/exampleApi';
import { exampleSlice } from '../features/example/exampleSlice';

export const store = configureStore({
  reducer: {
    example: exampleSlice.reducer,
    [exampleApi.reducerPath]: exampleApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(exampleApi.middleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
