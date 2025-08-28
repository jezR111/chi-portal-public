// src/components/providers/Providers.tsx
'use client'

import { ThemeProvider } from 'next-themes'
import { ReactNode } from 'react'
import { AuthProvider } from '../providers/AuthProvider'
import { ToastProvider } from '../providers/ToastProvider'

type Props = { children: ReactNode }

/**
 * Global providers wrapper
 * Uses next-themes for dark/light mode (not Chakra)
 */
export function Providers({ children }: Props) {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
      storageKey="chi-portal-theme"
    >
      <AuthProvider>
        <ToastProvider>{children}</ToastProvider>
      </AuthProvider>
    </ThemeProvider>
  )
}