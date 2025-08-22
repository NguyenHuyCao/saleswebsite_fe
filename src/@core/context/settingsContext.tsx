"use client";
import { createContext, useEffect, useMemo, useState, ReactNode } from "react";
import { PaletteMode } from "@mui/material";
import themeConfig from "@/configs/themeConfig";
import type { ThemeColor, ContentWidth } from "src/@core/layouts/types";

export type Settings = {
  mode: PaletteMode;
  themeColor: ThemeColor;
  contentWidth: ContentWidth;
};
export type SettingsContextValue = {
  settings: Settings;
  saveSettings: (s: Settings) => void;
};

const STORAGE_KEY = "app_settings_v1";

const initial: Settings = {
  mode: themeConfig.mode,
  themeColor: "primary",
  contentWidth: themeConfig.contentWidth,
};

export const SettingsContext = createContext<SettingsContextValue>({
  settings: initial,
  saveSettings: () => {},
});

export const SettingsProvider = ({ children }: { children: ReactNode }) => {
  const [settings, setSettings] = useState<Settings>(initial);
  const [ready, setReady] = useState(false);

  // Hydrate từ localStorage (client only)
  useEffect(() => {
    try {
      const raw =
        typeof window !== "undefined"
          ? window.localStorage.getItem(STORAGE_KEY)
          : null;
      if (raw) setSettings({ ...initial, ...JSON.parse(raw) });
    } catch {
      /* ignore */
    }
    setReady(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const saveSettings = (s: Settings) => {
    setSettings(s);
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(s));
    } catch {}
  };

  const value = useMemo(() => ({ settings, saveSettings }), [settings]);

  // Tránh flash khi chưa hydrate
  if (!ready) return null;

  return (
    <SettingsContext.Provider value={value}>
      {children}
    </SettingsContext.Provider>
  );
};

export const SettingsConsumer = SettingsContext.Consumer;
