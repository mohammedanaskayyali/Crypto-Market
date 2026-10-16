// src/store/features/watchlistSlice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface WatchlistState {
    items: string[]; // تخزين معرفات العملات (Asset IDs) مثل ['bitcoin', 'ethereum']
}

// دالة آمنة لقراءة المفضلة من المتصفح لتجنب مشاكل الـ Hydration
const loadInitialWatchlist = (): string[] => {
    if (typeof window === 'undefined') return [];
    try {
        const saved = localStorage.getItem('crypto_watchlist');
        return saved ? JSON.parse(saved) : [];
    } catch (error) {
        console.error('Failed to load watchlist from localStorage', error);
        return [];
    }
};

const initialState: WatchlistState = {
    items: loadInitialWatchlist(),
};

export const watchlistSlice = createSlice({
    name: 'watchlist',
    initialState,
    reducers: {
        toggleWatchlist: (state, action: PayloadAction<string>) => {
            const id = action.payload;
            const index = state.items.indexOf(id);
            if (index >= 0) {
                state.items.splice(index, 1); // إزالة العملة إذا كانت موجودة مسبقاً
            } else {
                state.items.push(id); // إضافة العملة إذا لم تكن موجودة
            }
            // حفظ التحديثات في المتصفح
            if (typeof window !== 'undefined') {
                localStorage.setItem('crypto_watchlist', JSON.stringify(state.items));
            }
        },
    },
});

export const { toggleWatchlist } = watchlistSlice.actions;
export default watchlistSlice.reducer;