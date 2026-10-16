// src/components/ui/MotionWrapper.tsx
'use client';

import React from 'react';
import { motion } from 'framer-motion';

interface MotionWrapperProps {
    children: React.ReactNode;
    className?: string;
    delay?: number;
}

export const MotionWrapper: React.FC<MotionWrapperProps> = ({ children, className = '', delay = 0 }) => {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: delay, ease: 'easeOut' }}
            className={className}
        >
            {children}
        </motion.div>
    );
};