'use client';

import { ThemeProvider } from 'next-themes';
import { NextUIProvider } from '@nextui-org/react';

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="light"
      themes={['light']}
      enableSystem={false}
      disableTransitionOnChange
    >
      <NextUIProvider>
        {children}
      </NextUIProvider>
    </ThemeProvider>
  );
}
