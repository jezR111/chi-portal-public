// src/components/ui/Toaster.tsx
'use client'

import { useToast } from '@/components/providers/ToastProvider'
import { Toast } from '@/components/ui/Toast'

/**
 * Global toast container
 * Renders all active toast notifications
 */
export function Toaster() {
  const { toasts } = useToast()

  return (
    <div className="pointer-events-none fixed inset-0 z-50 flex flex-col items-end justify-end p-4 sm:p-6">
      <div className="pointer-events-auto flex w-full max-w-sm flex-col gap-2">
        {toasts.map((toast) => (
          <Toast key={toast.id} {...toast} />
        ))}
      </div>
    </div>
  )
}