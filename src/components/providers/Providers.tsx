// src/components/providers/Providers.tsx
'use client'

import { QuestStateProvider } from '@/features/yin/hooks/useQuestState'
import { ThemeProvider } from 'next-themes'
import React from 'react'
import { AuthProvider } from './AuthProvider'
import { ToastProvider } from './ToastProvider'

interface ProvidersProps {
  children: React.ReactNode;
}

export function Providers({ children }: ProvidersProps) {
  return (
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
  );
}