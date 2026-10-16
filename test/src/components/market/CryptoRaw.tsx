// src/components/market/CryptoRow.tsx
'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { CryptoAsset } from '@/types/crypto';
import { WatchlistButton } from './WatchlistButton';

interface CryptoRowProps {
    asset: CryptoAsset;
}

// استخدام React.memo لتحسين الأداء ومنع إعادة عرض الصف إلا عند تغير بياناته حقاً (مطلب خطوة 7)
export const CryptoRow = React.memo(({ asset }: CryptoRowProps) => {
    const isPositive = (asset.price_change_percentage_24h ?? 0) >= 0;

    return (
        <tr className="hover:bg-slate-800/50 transition-colors">
            <td className="p-4 font-medium text-slate-400">{asset.market_cap_rank}</td>
            <td className="p-4 flex items-center gap-3">
                <Image src={asset.image} alt={asset.name} width={28} height={28} className="rounded-full" />
                <div>
                    <div className="font-semibold">{asset.name}</div>
                    <div className="text-xs text-slate-400 uppercase">{asset.symbol}</div>
                </div>
            </td>
            <td className="p-4 font-medium">${asset.current_price?.toLocaleString()}</td>
            <td className={`p-4 font-semibold ${isPositive ? 'text-emerald-400' : 'text-rose-400'}`}>
                {isPositive ? '+' : ''}{asset.price_change_percentage_24h?.toFixed(2)}%
            </td>
            <td className="p-4 text-slate-300">${asset.market_cap?.toLocaleString()}</td>
            <td className="p-4 flex items-center gap-2">
                <Link
                    href={`/market/${asset.id}`}
                    className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-medium rounded-lg transition-colors"
                >
                    Details
                </Link>
                <WatchlistButton assetId={asset.id} />
            </td>
        </tr>
    );
});

CryptoRow.displayName = 'CryptoRow';