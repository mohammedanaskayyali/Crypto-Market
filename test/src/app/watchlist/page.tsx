// src/app/watchlist/page.tsx
'use client';

import React, { useEffect, useState, useCallback, useRef } from 'react';
import { useAppSelector } from '@/store/hooks';
import { CryptoAsset } from '@/types/crypto';
import Link from 'next/link';
import { MotionWrapper } from '@/components/ui/MotionWrapper';
import { CryptoRow } from '@/components/market/CryptoRaw';
import { BackButton } from '@/components/ui/BackButton';

export default function WatchlistPage() {
    const watchlistIds = useAppSelector((state) => state.watchlist.items);
    const [assets, setAssets] = useState<CryptoAsset[]>([]);
    const [loading, setLoading] = useState(true);
    const [isInitialized, setIsInitialized] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // مرجع لتتبع طول قائمة الـ IDs السابقة لمعرفة ما إذا تم الحذف أم الإضافة
    const prevWatchlistLengthRef = useRef(watchlistIds.length);

    useEffect(() => {
        setIsInitialized(true);
    }, []);

    const fetchWatchlistData = useCallback(async () => {
        if (!isInitialized) return;

        if (watchlistIds.length === 0) {
            setAssets([]);
            setLoading(false);
            setError(null);
            return;
        }

        try {
            setLoading(true);
            setError(null);
            const response = await fetch(
                `https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&ids=${watchlistIds.join(',')}&sparkline=false`
            );

            if (!response.ok) {
                throw new Error(`Failed to fetch: ${response.statusText}`);
            }
            const data = await response.json();
            setAssets(data);
        } catch (err) {
            console.error('Failed to fetch watchlist assets', err);
            setError('Unable to fetch cryptocurrency data. Please try again.');
        } finally {
            setLoading(false);
        }
    }, [watchlistIds, isInitialized]);

    // مراقبة التغيرات: إذا تم الحذف محلياً، نحدث الواجهة فوراً دون طلب API جديد
    useEffect(() => {
        if (!isInitialized) return;

        // إذا كان عدد العناصر قد نقص (أي تم حذف عملة)، نقوم بتصفية الجدول محلياً فوراً
        if (watchlistIds.length < prevWatchlistLengthRef.current) {
            setAssets((prev) => prev.filter((asset) => watchlistIds.includes(asset.id)));
            prevWatchlistLengthRef.current = watchlistIds.length;
            return;
        }

        prevWatchlistLengthRef.current = watchlistIds.length;
        fetchWatchlistData();
    }, [watchlistIds, isInitialized, fetchWatchlistData]);

    return (
        <main className="min-h-screen bg-slate-950 text-slate-100 p-6 md:p-12">
            <div className="max-w-7xl mx-auto">
                {/* رابط العودة للخلف مع حركة دخول */}
                <BackButton />

                {/* ترويسة الصفحة مع تأخير بسيط */}
                <MotionWrapper delay={0.1}>
                    <header className="mb-8">
                        <h1 className="text-3xl font-bold tracking-tight mb-2">My Watchlist</h1>
                        <p className="text-slate-400">Track your favorite crypto assets.</p>
                    </header>
                </MotionWrapper>

                {/* صندوق الجدول أو حالات التحميل/الفراغ مع حركة دخول متدرجة */}
                <MotionWrapper delay={0.2}>
                    <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-xl">
                        {!isInitialized || loading ? (
                            <div className="p-12 text-center text-slate-400 animate-pulse">Loading your watchlist...</div>
                        ) : error ? (
                            <div className="p-12 text-center">
                                <p className="text-rose-400 mb-4">{error}</p>
                                <button
                                    onClick={fetchWatchlistData}
                                    className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-sm font-medium transition-colors cursor-pointer shadow-md"
                                >
                                    Retry
                                </button>
                            </div>
                        ) : watchlistIds.length === 0 ? (
                            <div className="p-12 text-center text-slate-500">
                                <p className="text-lg mb-2">Your watchlist is empty.</p>
                                <p className="text-sm">Go back to the market overview and click &quot;Favorite&quot; on any asset.</p>
                            </div>
                        ) : (
                            <div className="overflow-x-auto">
                                <table className="w-full text-left border-collapse">
                                    <thead>
                                        <tr className="border-b border-slate-800 text-slate-400 text-sm bg-slate-900/50">
                                            <th className="p-4">#</th>
                                            <th className="p-4">Coin</th>
                                            <th className="p-4">Price</th>
                                            <th className="p-4">24h Change</th>
                                            <th className="p-4">Market Cap</th>
                                            <th className="p-4">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-800 text-sm">
                                        {assets.map((asset) => (
                                            <CryptoRow key={asset.id} asset={asset} />
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>
                </MotionWrapper>
            </div>
        </main>
    );
}