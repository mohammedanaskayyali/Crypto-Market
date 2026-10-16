// src/components/market/WatchlistButton.tsx
'use client';

import React from 'react';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { toggleWatchlist } from '@/store/features/watchlistSlice';

interface WatchlistButtonProps {
    assetId: string;
}

export const WatchlistButton: React.FC<WatchlistButtonProps> = ({ assetId }) => {
    const dispatch = useAppDispatch();
    const watchlist = useAppSelector((state) => state.watchlist.items);
    const isSaved = watchlist.includes(assetId);

    return (
        <button
            onClick={(e) => {
                e.preventDefault();
                dispatch(toggleWatchlist(assetId));
            }}
            title={isSaved ? 'Remove from Watchlist' : 'Add to Watchlist'}
            className={`w-8 h-8 shrink-0 flex items-center justify-center rounded-lg transition-all duration-200 border cursor-pointer ${isSaved
                ? 'bg-amber-500/15 border-amber-500/40 text-amber-400 hover:bg-amber-500/25 shadow-[0_0_10px_rgba(245,158,11,0.2)]'
                : 'bg-slate-800/60 border-slate-700/60 text-slate-400 hover:text-slate-200 hover:bg-slate-700/60'
                }`}
        >
            <span className={`text-base leading-none transition-transform duration-200 scale-120`}>
                {isSaved ? '★' : '☆'}
            </span>
        </button>
    );
};