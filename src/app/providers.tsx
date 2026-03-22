"use client";

import { ReactNode } from "react";
import {
  SettingsProvider,
  SettingsConsumer,
} from "src/@core/context/settingsContext";
import ThemeComponent from "@/@core/theme/overrides/ThemeComponent";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "@/lib/api/queryClient";
import { SocketProvider } from "@/lib/socket/SocketContext";
import { ToastProvider } from "@/lib/toast/ToastContext";

export default function Providers({ children }: { children: ReactNode }) {
  return (
    <SettingsProvider>
      <SettingsConsumer>
        {({ settings }) => (
          <QueryClientProvider client={queryClient}>
            <ToastProvider>
              <SocketProvider>
                <ThemeComponent settings={settings}>{children}</ThemeComponent>
              </SocketProvider>
            </ToastProvider>
          </QueryClientProvider>
        )}
      </SettingsConsumer>
    </SettingsProvider>
  );
}
