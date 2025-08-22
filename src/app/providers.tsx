"use client";

import { ReactNode } from "react";
import {
  SettingsProvider,
  SettingsConsumer,
} from "src/@core/context/settingsContext";
import ThemeComponent from "@/@core/theme/overrides/ThemeComponent";

export default function Providers({ children }: { children: ReactNode }) {
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
