"use client";

import ReduxProvider from "@/components/redux/Providers";
import RootProviders from "./providers";
import { quicksand } from "./fonts";
import { ReactNode } from "react";

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="vi">
      <body className={quicksand.className}>
        <ReduxProvider>
          <RootProviders>{children}</RootProviders>
        </ReduxProvider>
      </body>
    </html>
  );
}
