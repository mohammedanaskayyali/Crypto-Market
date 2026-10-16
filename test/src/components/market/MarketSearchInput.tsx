// src/components/market/MarketSearchInput.tsx
'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

interface MarketSearchInputProps {
    initialSearch: string;
}

export const MarketSearchInput: React.FC<MarketSearchInputProps> = ({ initialSearch }) => {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [searchTerm, setSearchTerm] = useState(initialSearch);

    useEffect(() => {
        const handler = setTimeout(() => {
            const params = new URLSearchParams(searchParams.toString());

            if (searchTerm.trim()) {
                params.set('search', searchTerm.trim());
                params.set('page', '1'); // العودة للصفحة الأولى عند البحث
            } else {
                params.delete('search');
            }

            // استخدام replace مع scroll: false لتحديث الرابط بسلاسة وبدون إعادة تحميل الصفحة
            router.replace(`/?${params.toString()}`, { scroll: false });
        }, 500); // تأخير نصف ثانية (Debounce) لكي ينتهي المستخدم من الكتابة

        return () => clearTimeout(handler);
    }, [searchTerm]); // ملاحظة هامة: الاعتماد على searchTerm فقط يمنع حلقة الطلبات المتكررة نهائياً

    return (
        <div className="w-full md:w-1/3">
            <input
                type="text"
                placeholder="Search coin by name or symbol..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-4 py-2 bg-slate-900 border border-slate-800 rounded-xl text-slate-100 placeholder-slate-500 text-sm focus:outline-none focus:border-indigo-500 shadow-md"
            />
        </div>
    );
};