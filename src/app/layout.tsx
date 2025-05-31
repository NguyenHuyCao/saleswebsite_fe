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
              <ThemeComponent settings={settings}>
                {children}
                {/* <ScrollToTop
                  smooth
                  top={300} // bao nhiêu px thì hiện nút
                  color="#fff"
                  style={{
                    background: "#ffb700",
                    borderRadius: "50%",
                    boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
                    zIndex: 9999,
                  }}
                /> */}
              </ThemeComponent>
            )}
          </SettingsConsumer>
        </SettingsProvider>
      </body>
    </html>
  );
}
