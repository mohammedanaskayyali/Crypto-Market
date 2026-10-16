// src/components/ui/BackButton.tsx
'use client';

import React from 'react';
import { useRouter } from 'next/navigation';

interface BackButtonProps {
    label?: string;
    className?: string;
}

export function BackButton({ label = 'Back', className = '' }: BackButtonProps) {
    const router = useRouter();

    return (
        <button
            onClick={() => router.back()}
            className={`mb-6 text-sm text-indigo-400 hover:text-indigo-300 hover:underline inline-flex items-center gap-1.5 transition-colors cursor-pointer ${className}`}
        >
            &larr; {label}
        </button>
    );
}