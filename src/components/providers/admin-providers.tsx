"use client";

import { ReactNode } from "react";
import {
  SettingsProvider,
  SettingsConsumer,
} from "@/@core/context/settingsContext";
import ThemeComponent from "@/@core/theme/overrides/ThemeComponent";

/**
 * Providers dành riêng cho khu vực admin:
 * - SettingsProvider: quản lý theme (dark/light), contentWidth, ...
 * - ThemeComponent: áp dụng @core full theme dựa trên settings
 *
 * Không dùng cho user-facing pages (user pages có ThemeRegistry riêng).
 */
export default function AdminProviders({ children }: { children: ReactNode }) {
  return (
    <SettingsProvider>
      <SettingsConsumer>
        {({ settings }) => (
          <ThemeComponent settings={settings}>{children}</ThemeComponent>
        )}
      </SettingsConsumer>
    </SettingsProvider>
  );
}
