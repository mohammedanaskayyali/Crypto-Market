// src/app/market/[id]/loading.tsx
import React from 'react';

export default function Loading() {
    return (
        <main className="min-h-screen bg-slate-950 text-slate-100 p-6 md:p-12">
            <div className="max-w-4xl mx-auto animate-pulse">
                {/* Back Button Skeleton */}
                <div className="w-16 h-4 bg-slate-800 rounded mb-6" />

                {/* Header Skeleton */}
                <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 md:p-8 shadow-xl mb-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                    <div className="flex items-center gap-4">
                        <div className="w-16 h-16 bg-slate-800 rounded-full" />
                        <div>
                            <div className="flex items-center gap-2 mb-2">
                                <div className="w-36 h-7 bg-slate-800 rounded" />
                                <div className="w-12 h-6 bg-slate-800 rounded" />
                            </div>
                            <div className="w-28 h-4 bg-slate-800 rounded" />
                        </div>
                    </div>

                    <div className="text-left md:text-right w-full md:w-auto">
                        <div className="w-32 h-8 bg-slate-800 rounded mb-2 md:ml-auto" />
                        <div className="w-20 h-4 bg-slate-800 rounded md:ml-auto" />
                    </div>
                </div>

                {/* Statistics Grid Skeleton */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    {[1, 2, 3].map((item) => (
                        <div key={item} className="bg-slate-900 border border-slate-800 p-5 rounded-xl">
                            <div className="w-24 h-4 bg-slate-800 rounded mb-2" />
                            <div className="w-32 h-6 bg-slate-800 rounded" />
                        </div>
                    ))}
                </div>

                {/* Chart Section Skeleton */}
                <div className="bg-slate-900 border border-slate-800 p-6 md:p-8 rounded-xl mb-8 h-72 flex items-center justify-center">
                    <div className="text-slate-700 text-sm font-medium">Loading Chart Data...</div>
                </div>

                {/* Description Skeleton */}
                <div className="bg-slate-900 border border-slate-800 p-6 md:p-8 rounded-xl space-y-3">
                    <div className="w-40 h-6 bg-slate-800 rounded mb-4" />
                    <div className="w-full h-4 bg-slate-800 rounded" />
                    <div className="w-5/6 h-4 bg-slate-800 rounded" />
                    <div className="w-4/6 h-4 bg-slate-800 rounded" />
                </div>
            </div>
        </main>
    );
}