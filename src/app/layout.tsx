"use client";

import { Quicksand } from "next/font/google";
import { ReactNode } from "react";
import {
  SettingsProvider,
  SettingsConsumer,
} from "src/@core/context/settingsContext";
import ThemeComponent from "src/@core/theme/ThemeComponent";

const quicksand = Quicksand({
  subsets: ["latin"],
  weight: ["400", "500", "700"],
  display: "swap",
});

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="vi">
      <body className={quicksand.className}>
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
