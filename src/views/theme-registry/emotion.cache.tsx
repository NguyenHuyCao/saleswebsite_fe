"use client";

import * as React from "react";
import { useServerInsertedHTML } from "next/navigation";
import createCache from "@emotion/cache";
import { CacheProvider as DefaultCacheProvider } from "@emotion/react";
import type {
  EmotionCache,
  Options as OptionsOfCreateCache,
} from "@emotion/cache";

export type NextAppDirEmotionCacheProviderProps = {
  options: Omit<OptionsOfCreateCache, "insertionPoint">;
  CacheProvider?: (props: {
    value: EmotionCache;
    children: React.ReactNode;
  }) => React.JSX.Element | null;
  children: React.ReactNode;
};

export default function NextAppDirEmotionCacheProvider({
  options,
  CacheProvider = ({ value, children }) => (
    <DefaultCacheProvider value={value}>{children}</DefaultCacheProvider>
  ),
  children,
}: NextAppDirEmotionCacheProviderProps) {
  const [registry] = React.useState(() => {
    const cache = createCache(options);
    cache.compat = true;

    const prevInsert = cache.insert;
    let inserted: { name: string; isGlobal: boolean }[] = [];

    cache.insert = (...args) => {
      const [selector, serialized] = args;
      if (cache.inserted[serialized.name] === undefined) {
        inserted.push({
          name: serialized.name,
          isGlobal: !selector,
        });
      }
      return prevInsert(...args);
    };

    const flush = () => {
      const prevInserted = inserted;
      inserted = [];
      return prevInserted;
    };

    return { cache, flush };
  });

  useServerInsertedHTML(() => {
    const inserted = registry.flush();
    if (inserted.length === 0) return null;

    let styles = "";
    let dataEmotionAttribute = registry.cache.key;

    const globals: React.ReactElement[] = [];

    for (const { name, isGlobal } of inserted) {
      const rawStyle = registry.cache.inserted[name];
      if (typeof rawStyle === "string") {
        if (isGlobal) {
          const safeStyle = rawStyle;
          globals.push(
            <style
              key={name}
              data-emotion={`${registry.cache.key}-global ${name}`}
              children={safeStyle}
            />
          );
        } else {
          styles += rawStyle;
          dataEmotionAttribute += ` ${name}`;
        }
      }
    }

    return (
      <>
        {globals}
        {styles && (
          <style data-emotion={dataEmotionAttribute} children={styles} />
        )}
      </>
    );
  });

  return <CacheProvider value={registry.cache}>{children}</CacheProvider>;
}
