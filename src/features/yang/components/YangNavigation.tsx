// src/features/yang/components/YangNavigation.tsx
'use client';

import {
  Apple,
  BarChart3,
  ChevronLeft,
  Dumbbell,
  Flame,
  Heart, Mountain,
  Settings
} from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion } from 'framer-motion';

export default function YangNavigation() {
  const pathname = usePathname();
  
  const navItems = [
    { href: '/vitality', icon: Flame, label: 'Overview' },
    { href: '/vitality/training', icon: Dumbbell, label: 'Training' },
    { href: '/vitality/nutrition', icon: Apple, label: 'Nutrition' },
    { href: '/vitality/recovery', icon: Heart, label: 'Recovery' },
    { href: '/vitality/mountain', icon: Mountain, label: 'Progress' },
    { href: '/vitality/analytics', icon: BarChart3, label: 'Analytics' },
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-gradient-to-r from-gray-900/95 via-orange-900/95 to-gray-900/95 backdrop-blur-xl border-b border-orange-500/20">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Back to Portal */}
          <Link href="/dashboard" className="flex items-center gap-2 text-orange-300 hover:text-orange-400 transition-colors">
            <ChevronLeft className="w-5 h-5" />
            <span className="hidden md:inline">Portal</span>
          </Link>
          
          {/* Navigation Items */}
          <div className="flex items-center gap-1">
            {navItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link key={item.href} href={item.href}>
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className={`px-4 py-2 rounded-lg flex items-center gap-2 transition-all ${
                      isActive 
                        ? 'bg-orange-500/20 text-orange-400' 
                        : 'text-gray-400 hover:text-orange-400 hover:bg-orange-500/10'
                    }`}
                  >
                    <item.icon className="w-5 h-5" />
                    <span className="hidden lg:inline text-sm font-medium">{item.label}</span>
                  </motion.div>
                </Link>
              );
            })}
          </div>
          
          {/* Settings */}
          <Link href="/vitality/settings">
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="p-2 rounded-lg text-gray-400 hover:text-orange-400 hover:bg-orange-500/10 transition-all"
            >
              <Settings className="w-5 h-5" />
            </motion.div>
          </Link>
        </div>
      </div>
    </nav>
  );
}