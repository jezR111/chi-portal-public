// src/app/(portal)/yang/layout.tsx
'use client';

import { YangBackground } from '@/features/yang/components/YangBackground';
import YangNavigation from '@/features/yang/components/YangNavigation';
import { motion } from 'framer-motion';
import { ReactNode } from 'react';
import FloatingParticles from './FloatingParticles';

interface YangLayoutProps {
  children: ReactNode;
}

export default function YangLayout({ children }: YangLayoutProps) {
  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Dynamic Earth-themed Background */}
      <YangBackground />
      
      {/* Yang Navigation Bar */}
      <YangNavigation />
      
      {/* Main Content */}
      <motion.main
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative z-10 pt-20"
      >
        <div className="container mx-auto px-4 pb-12">
          {children}
        </div>
      </motion.main>
      
  {/* Floating Energy Particles (SSR-safe) */}
  {typeof window !== 'undefined' && <FloatingParticles />}
    </div>
  );
}
