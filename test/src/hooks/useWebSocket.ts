// src/hooks/useBinanceSocket.ts
'use client';

import { useState, useEffect, useRef } from 'react';

type ConnectionStatus = 'Connected' | 'Reconnecting' | 'Disconnected';

export function useBinanceSocket(symbol: string = 'btcusdt') {
    const [price, setPrice] = useState<string | null>(null);
    const [status, setStatus] = useState<ConnectionStatus>('Disconnected');
    const wsRef = useRef<WebSocket | null>(null);
    const reconnectTimeoutRef = useRef<NodeJS.Timeout | null>(null);

    useEffect(() => {
        let isMounted = true;

        const connect = () => {
            setStatus('Reconnecting');
            const wsUrl = `wss://stream.binance.com:9443/ws/${symbol.toLowerCase()}@trade`;
            const ws = new WebSocket(wsUrl);
            wsRef.current = ws;

            ws.onopen = () => {
                if (isMounted) {
                    setStatus('Connected');
                }
            };

            ws.onmessage = (event) => {
                if (!isMounted) return;
                try {
                    const data = JSON.parse(event.data);
                    if (data.p) {
                        setPrice(data.p); // تحديث السعر الحي الوارد من البث
                    }
                } catch (err) {
                    console.error('Failed to parse WebSocket message', err);
                }
            };

            ws.onerror = (error) => {
                console.error('WebSocket error:', error);
            };

            ws.onclose = () => {
                if (!isMounted) return;
                setStatus('Disconnected');
                // محاولة إعادة الاتصال بعد 5 ثوانٍ
                reconnectTimeoutRef.current = setTimeout(() => {
                    if (isMounted) connect();
                }, 5000);
            };
        };

        connect();

        // التنظيف عند إلغاء تحميل المكون (Cleanup) لضمان عدم حدوث تسريب اتصال
        return () => {
            isMounted = false;
            if (wsRef.current) {
                wsRef.current.close();
            }
            if (reconnectTimeoutRef.current) {
                clearTimeout(reconnectTimeoutRef.current);
            }
        };
    }, [symbol]);

    return { price, status };
}