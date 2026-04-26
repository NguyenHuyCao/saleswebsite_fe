"use client";

import { ReactNode } from "react";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "@/lib/api/queryClient";
import { SocketProvider } from "@/lib/socket/SocketContext";
import { ToastProvider } from "@/lib/toast/ToastContext";

/**
 * Root providers — chỉ chứa những gì CẢ HAI user và admin đều cần:
 * - QueryClientProvider: shared React Query cache
 * - ToastProvider: global toast/snackbar
 * - SocketProvider: WebSocket (thông báo đơn hàng user, hỗ trợ admin)
 *
 * Theme providers được tách biệt:
 * - User: ThemeRegistry trong (user)/layout.tsx
 * - Admin: AdminProviders trong admin/layout.tsx
 */
export default function RootProviders({ children }: { children: ReactNode }) {
  return (
    <QueryClientProvider client={queryClient}>
      <ToastProvider>
        <SocketProvider>{children}</SocketProvider>
      </ToastProvider>
    </QueryClientProvider>
  );
}
