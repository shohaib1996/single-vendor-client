'use client';

import * as React from "react";
import { ThemeProvider as NextThemesProvider } from "next-themes";
import StoreProvider from "./StoreProvider";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <StoreProvider>
      <NextThemesProvider
        attribute="class"
        defaultTheme="dark"
        enableSystem
        disableTransitionOnChange
      >
        {children}
      </NextThemesProvider>
    </StoreProvider>
  );
}