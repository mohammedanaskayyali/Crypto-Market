// src/components/market/MarketSortControls.tsx
'use client';

import React from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

export const MarketSortControls = () => {
    const router = useRouter();
    const searchParams = useSearchParams();

    const currentSortBy = searchParams.get('sortBy') || 'market_cap';
    const currentSortOrder = searchParams.get('sortOrder') || 'desc';

    const handleSortChange = (newSortBy: string) => {
        const params = new URLSearchParams(searchParams.toString());
        params.set('sortBy', newSortBy);
        params.set('page', '1'); // العودة للصفحة الأولى عند تغيير الترتيب
        router.replace(`/?${params.toString()}`, { scroll: false });
    };

    const toggleOrder = () => {
        const newOrder = currentSortOrder === 'desc' ? 'asc' : 'desc';
        const params = new URLSearchParams(searchParams.toString());
        params.set('sortOrder', newOrder);
        params.set('page', '1');
        router.replace(`/?${params.toString()}`, { scroll: false });
    };

    return (
        <div className="flex items-center gap-3 w-full md:w-auto justify-end">
            <select
                value={currentSortBy}
                onChange={(e) => handleSortChange(e.target.value)}
                className="px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-slate-300 text-sm focus:outline-none focus:border-indigo-500 shadow-md cursor-pointer"
            >
                <option value="market_cap">Market Cap</option>
                <option value="price_change">24h Change</option>
                <option value="volume">Volume</option>
            </select>

            <button
                onClick={toggleOrder}
                className="px-4 py-2 bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-200 text-sm rounded-xl transition-colors font-medium shadow-md flex items-center gap-1 cursor-pointer"
            >
                {currentSortOrder === 'desc' ? 'Asc ↑' : 'Desc ↓'}
            </button>
        </div>
    );
};