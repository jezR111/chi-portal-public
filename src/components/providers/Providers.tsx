'use client'

import { ThemeProvider } from 'next-themes'
import React from 'react'
import { QuestStateProvider } from '../../features/yin/hooks/useQuestState'
import { AuthProvider } from './AuthProvider'
import { PerformanceModeProvider } from './PerformanceModeProvider'
import { ToastProvider } from './ToastProvider'

interface ProvidersProps {
  children: React.ReactNode;
}

/**
 * Global providers wrapper
 * Uses next-themes for dark/light mode (not Chakra)
 */
export function Providers({ children }: ProvidersProps) {
  return (
    // Stack your providers here - order can matter!
    // Auth usually goes first, then data providers, then UI providers
    <PerformanceModeProvider>
      <QuestStateProvider>
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
      </QuestStateProvider>
    </PerformanceModeProvider>
  );
}

