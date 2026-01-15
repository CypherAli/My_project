'use client';

import React, { useEffect } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { wsClient } from '@/lib/websocket/client';

const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            refetchOnWindowFocus: false,
            retry: 1,
        },
    },
});

export default function Providers({ children }: { children: React.ReactNode }) {
    useEffect(() => {
        // Connect WebSocket on mount
        wsClient.connect();

        return () => {
            // Disconnect on unmount
            wsClient.disconnect();
        };
    }, []);

    return (
        <QueryClientProvider client={queryClient}>
            {children}
        </QueryClientProvider>
    );
}
