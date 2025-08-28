// src/app/layout.tsx
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'

import { Providers } from '../components/providers/Providers'
import './globals.css'
// If you don't have a Toaster yet, comment both lines:
// import { Toaster } from '../components/ui/Toaster'

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
})

export const metadata: Metadata = {
  title: {
    default: 'Chi Portal - Transform Within',
    template: '%s | Chi Portal',
  },
  description:
    'Harmonize your inner self (Yin) and physical vitality (Yang) through guided transformation.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      className={inter.variable}
      suppressHydrationWarning
    >
      <body className="min-h-screen bg-background font-sans antialiased">
        <Providers>
          {/* Premium gradient background */}
          <div className="fixed inset-0 -z-10 h-full w-full">
            <div className="absolute inset-0 bg-gradient-to-br from-primary-50 via-white to-purple-50 dark:from-gray-950 dark:via-gray-900 dark:to-primary-950" />
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-primary-100/20 via-transparent to-transparent dark:from-primary-900/20" />
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,_var(--tw-gradient-stops))] from-purple-100/20 via-transparent to-transparent dark:from-purple-900/20" />
          </div>

          {/* Main content */}
          <div className="relative flex min-h-screen flex-col">
            {children}
          </div>

          {/* Global UI */}
          {/* <Toaster /> */}
        </Providers>
      </body>
    </html>
  )
}
