// app/layout.tsx
"use client";

import { ReactNode } from "react";
import {
  SettingsProvider,
  SettingsConsumer,
} from "src/@core/context/settingsContext";
import ThemeComponent from "src/@core/theme/ThemeComponent";

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="vi">
      <body>
        <SettingsProvider>
          <SettingsConsumer>
            {({ settings }) => (
              <ThemeComponent settings={settings}>{children}</ThemeComponent>
            )}
          </SettingsConsumer>
        </SettingsProvider>
      </body>
    </html>
  );
}
