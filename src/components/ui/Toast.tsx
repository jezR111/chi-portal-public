// src/components/ui/Toast.tsx
'use client'

import { useToast, type ToastType } from '@/components/providers/ToastProvider'
import { cn } from '@/lib/utils/cn'
import { AnimatePresence, motion } from 'framer-motion'
import { AlertCircle, AlertTriangle, CheckCircle, Info, X } from 'lucide-react'
import { useState } from 'react'

interface ToastProps {
  id: string
  type: ToastType
  title: string
  description?: string
  duration?: number
}

const toastIcons = {
  success: CheckCircle,
  error: AlertCircle,
  info: Info,
  warning: AlertTriangle,
}

const toastStyles = {
  success: 'bg-gradient-to-r from-green-500/10 to-emerald-500/10 border-green-500/20 text-green-900 dark:text-green-100',
  error: 'bg-gradient-to-r from-red-500/10 to-rose-500/10 border-red-500/20 text-red-900 dark:text-red-100',
  info: 'bg-gradient-to-r from-blue-500/10 to-sky-500/10 border-blue-500/20 text-blue-900 dark:text-blue-100',
  warning: 'bg-gradient-to-r from-amber-500/10 to-orange-500/10 border-amber-500/20 text-amber-900 dark:text-amber-100',
}

/**
 * Individual toast notification component
 * Displays with icon, title, description, and close button
 */
export function Toast({ id, type, title, description }: ToastProps) {
  const { removeToast } = useToast()
  const [isVisible, setIsVisible] = useState(true)
  const Icon = toastIcons[type]

  const handleClose = () => {
    setIsVisible(false)
    setTimeout(() => removeToast(id), 300)
  }

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: 50, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 20, scale: 0.95 }}
          transition={{ duration: 0.2, ease: 'easeOut' }}
          className={cn(
            'glass-dark relative flex w-full items-start gap-3 rounded-xl border p-4 shadow-2xl',
            toastStyles[type]
          )}
        >
          <Icon className="h-5 w-5 flex-shrink-0 mt-0.5" />
          
          <div className="flex-1 space-y-1">
            <p className="text-sm font-semibold">{title}</p>
            {description && (
              <p className="text-xs opacity-90">{description}</p>
            )}
          </div>

          <button
            onClick={handleClose}
            className="flex-shrink-0 rounded-lg p-1 transition-colors hover:bg-white/10"
            aria-label="Close notification"
          >
            <X className="h-4 w-4" />
          </button>

          {/* Progress bar for auto-dismiss */}
          <div className="absolute bottom-0 left-0 h-1 w-full overflow-hidden rounded-b-xl">
            <motion.div
              className="h-full bg-gradient-to-r from-white/20 to-white/40"
              initial={{ width: '100%' }}
              animate={{ width: '0%' }}
              transition={{ duration: 5, ease: 'linear' }}
            />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}