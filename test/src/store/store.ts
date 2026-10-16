// src/store/store.ts
import { configureStore } from '@reduxjs/toolkit';
import watchlistReducer from './features/watchlistSlice';

export const store = configureStore({
    reducer: {
        watchlist: watchlistReducer,
    },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;