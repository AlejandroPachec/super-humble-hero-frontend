"use client";

import { SWRConfig } from "swr";
import { ReactNode } from "react";

interface ProvidersProps {
  children: ReactNode;
}

/**
 * Global providers wrapper component
 */
export function Providers({ children }: ProvidersProps) {
  return (
    <SWRConfig
      value={{
        fetcher: (url: string) => fetch(url).then((res) => res.json()),
        revalidateOnFocus: true,
        revalidateOnReconnect: true,
      }}>
      {children}
    </SWRConfig>
  );
}
