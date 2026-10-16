// src/components/market/SparklineChart.tsx
'use client';

import React from 'react';

interface SparklineChartProps {
    prices?: number[];
    currentPrice: number;
    priceChange24h: number | null;
    isPositive: boolean;
}

export const SparklineChart: React.FC<SparklineChartProps> = ({ prices, currentPrice, priceChange24h, isPositive }) => {
    // إذا لم تتوفر بيانات من الـ API، نقوم بتوليد 7 نقاط وهمية واقعية مبنية على السعر الحالي ونسبة التغير
    let chartPrices = prices;
    if (!chartPrices || chartPrices.length === 0) {
        const change = priceChange24h ?? (isPositive ? 2 : -2);
        const startPrice = currentPrice / (1 + change / 100);
        chartPrices = [];

        // توليد 7 نقاط تمثل اتجاه الأسبوع بتمويجات واقعية
        for (let i = 0; i < 7; i++) {
            const progress = i / 6;
            const interpolated = startPrice + (currentPrice - startPrice) * progress;
            // إضافة تقلبات طفيفة عشوائية لشكل الخط البياني
            const fluctuation = (Math.random() - 0.5) * (currentPrice * 0.008);
            chartPrices.push(i === 6 ? currentPrice : interpolated + fluctuation);
        }
    }

    const min = Math.min(...chartPrices);
    const max = Math.max(...chartPrices);
    const range = max - min === 0 ? 1 : max - min;
    const width = 600;
    const height = 160;

    const points = chartPrices
        .map((price, index) => {
            const x = (index / (chartPrices.length - 1)) * width;
            const y = height - ((price - min) / range) * (height - 30) - 15;
            return `${x},${y}`;
        })
        .join(' ');

    const strokeColor = isPositive ? '#34d399' : '#f87171'; // أخضر للأبهاج، أحمر للانخفاض
    const gradientId = `chart-gradient-${isPositive ? 'pos' : 'neg'}`;

    return (
        <div className="w-full overflow-hidden">
            <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-40">
                <defs>
                    <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor={strokeColor} stopOpacity="0.25" />
                        <stop offset="100%" stopColor={strokeColor} stopOpacity="0.0" />
                    </linearGradient>
                </defs>
                <polyline fill="none" stroke={strokeName(strokeColor)} strokeWidth="2.5" points={points} />
                <polygon fill={`url(#${gradientId})`} points={`0,${height} ${points} ${width},${height}`} />
            </svg>
        </div>
    );
};

// دالة مساعدة للألوان
function strokeName(color: string) {
    return color;
}