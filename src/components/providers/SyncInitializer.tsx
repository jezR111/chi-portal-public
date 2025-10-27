// src/components/providers/SyncInitializer.tsx
'use client';

import { InsightSyncService } from '@/features/yin/services/insightSyncService';
import { useEffect } from 'react';

export function SyncInitializer() {
  useEffect(() => {
    const syncService = InsightSyncService.getInstance();
    syncService.startSync();

    return () => {
      syncService.stopSync();
    };
  }, []);

  return null; // This component doesn't render anything
}