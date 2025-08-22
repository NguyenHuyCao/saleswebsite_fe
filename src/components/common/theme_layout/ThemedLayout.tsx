// components/ThemedLayout.tsx
"use client";

import {
  SettingsProvider,
  SettingsConsumer,
} from "src/@core/context/settingsContext";
import ThemeComponent from "@/@core/theme/overrides/ThemeComponent";
import Providers from "@/components/redux/Providers";

export default function ThemedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SettingsProvider>
      <SettingsConsumer>
        {({ settings }) => (
          <ThemeComponent settings={settings}>
            <Providers>{children}</Providers>
          </ThemeComponent>
        )}
      </SettingsConsumer>
    </SettingsProvider>
  );
}
