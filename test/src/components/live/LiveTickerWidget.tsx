// src/components/live/LiveTickerWidget.tsx
'use client';

import React from 'react';
import { useBinanceSocket } from '@/hooks/useWebSocket';

interface LiveTickerWidgetProps {
    symbol?: string;
    coinName?: string;
}

export const LiveTickerWidget: React.FC<LiveTickerWidgetProps> = ({
    symbol = 'btcusdt',
    coinName = 'Bitcoin'
}) => {
    const { price, status } = useBinanceSocket(symbol);

    // تحديد ألوان ودلالات حالة الاتصال بأسلوب عصري
    const getStatusConfig = () => {
        switch (status) {
            case 'Connected':
                return { dot: 'bg-emerald-400 shadow-[0_0_10px_#34d399]', text: 'text-emerald-400', label: 'Live' };
            case 'Reconnecting':
                return { dot: 'bg-amber-400 shadow-[0_0_10px_#fbbf24]', text: 'text-amber-400', label: 'Reconnecting' };
            default:
                return { dot: 'bg-rose-400 shadow-[0_0_10px_#f87171]', text: 'text-rose-400', label: 'Disconnected' };
        }
    };

    const statusConfig = getStatusConfig();

    return (
        <div className="relative overflow-hidden bg-linear-to-br from-slate-900/90 via-slate-900 to-slate-950 border border-slate-800/80 rounded-2xl p-6 shadow-2xl backdrop-blur-xl transition-all hover:border-slate-700/80">
            {/* تأثير إضاءة خلفية خفيفة */}
            <div className="absolute -top-12 -right-12 w-32 h-32 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                {/* معلومات العملة والحالة */}
                <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-slate-800/80 border border-slate-700/50 flex items-center justify-center font-bold text-indigo-400 shadow-inner text-lg">
                        {coinName.slice(0, 3).toUpperCase()}
                    </div>
                    <div>
                        <div className="flex items-center gap-2 mb-1">
                            <span className="text-[14px] font-semibold uppercase tracking-wider text-slate-400">
                                {coinName} / USDT
                            </span>
                            <span className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-slate-800/60 border border-slate-700/40 text-[11px] font-medium">
                                <span className={`w-2 h-2 rounded-full ${statusConfig.dot} animate-pulse`} />
                                <span className={statusConfig.text}>{statusConfig.label}</span>
                            </span>
                        </div>
                        <h4 className="text-sm text-slate-500">Real-Time Binance Feed</h4>
                    </div>
                </div>

                {/* عرض السعر الحي */}
                <div className="text-left sm:text-right w-full sm:w-auto pt-3 sm:pt-0 border-t sm:border-t-0 border-slate-800/60">
                    <div className="text-3xl font-black font-mono tracking-tight text-slate-100">
                        {price ? (
                            <span className="bg-linear-to-r from-indigo-300 via-white to-indigo-100 bg-clip-text text-transparent">
                                ${Number(price).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                            </span>
                        ) : (
                            <span className="text-slate-500 text-lg font-sans animate-pulse">Connecting stream...</span>
                        )}
                    </div>
                    <div className="text-[11px] text-slate-400 mt-1 font-medium tracking-wide">
                        Binance WebSocket Stream
                    </div>
                </div>
            </div>
        </div>
    );
};