// src/app/(portal)/dashboard/YinYangPortal.tsx
'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { useState } from 'react';

export const YinYangPortal = () => {
  const [hoveredRealm, setHoveredRealm] = useState<'yin' | 'yang' | null>(null);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: 0.2, type: "spring", stiffness: 100 }}
      className="relative"
    >
      {/* Outer glow */}
      <div className="absolute -inset-8 blur-3xl opacity-40">
        <div className="absolute inset-0 bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 rounded-full animate-pulse" />
      </div>

      {/* Main container */}
      <div className="relative w-80 h-80">
        {/* Use CSS to create perfect yin-yang */}
        <div className="relative w-full h-full rounded-full overflow-hidden shadow-[0_0_40px_rgba(100,200,255,0.5)]">
          {/* White background */}
          <div className="absolute inset-0 bg-gradient-to-br from-white to-gray-100" />
          
          {/* Black half (Yin) - using clip-path */}
          <div 
            className="absolute inset-0 bg-gradient-to-br from-gray-900 to-black"
            style={{
              clipPath: 'polygon(50% 0%, 0% 0%, 0% 100%, 50% 100%, 50% 75%, 25% 50%, 50% 25%, 50% 0%)'
            }}
          />
          
          {/* Large black circle for curve */}
          <div 
            className="absolute w-40 h-40 rounded-full bg-gradient-to-br from-gray-900 to-black"
            style={{ top: '0%', left: '25%' }}
          />
          
          {/* Large white circle for curve */}
          <div 
            className="absolute w-40 h-40 rounded-full bg-gradient-to-br from-white to-gray-100"
            style={{ bottom: '0%', left: '25%' }}
          />
          
          {/* Small white dot in black */}
          <div 
            className="absolute w-12 h-12 rounded-full bg-gradient-to-br from-white to-gray-200 shadow-inner"
            style={{ top: '20%', left: '44%' }}
          />
          
          {/* Small black dot in white */}
          <div 
            className="absolute w-12 h-12 rounded-full bg-gradient-to-br from-gray-900 to-black shadow-inner"
            style={{ bottom: '20%', left: '44%' }}
          />

          {/* Interactive overlays */}
          <Link href="/yin">
            <div 
              className="absolute inset-y-0 left-0 w-1/2 cursor-pointer z-10"
              onMouseEnter={() => setHoveredRealm('yin')}
              onMouseLeave={() => setHoveredRealm(null)}
            />
          </Link>
          
          <Link href="/yang">
            <div 
              className="absolute inset-y-0 right-0 w-1/2 cursor-pointer z-10"
              onMouseEnter={() => setHoveredRealm('yang')}
              onMouseLeave={() => setHoveredRealm(null)}
            />
          </Link>

          {/* Hover effect overlay */}
          {hoveredRealm && (
            <motion.div
              className="absolute inset-0 rounded-full pointer-events-none"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              style={{
                boxShadow: hoveredRealm === 'yin' 
                  ? 'inset -100px 0 100px -50px rgba(139, 92, 246, 0.5)' 
                  : 'inset 100px 0 100px -50px rgba(251, 146, 60, 0.5)'
              }}
            />
          )}
        </div>

        {/* Glowing border */}
        <div className="absolute inset-0 rounded-full ring-2 ring-cyan-400/50 ring-offset-4 ring-offset-transparent" />
      </div>

      {/* Labels */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="flex w-full">
          <motion.div 
            className="flex-1 text-center -ml-8"
            animate={{ scale: hoveredRealm === 'yin' ? 1.1 : 1 }}
          >
            <p className="text-white font-bold text-xl drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">Yin</p>
            <p className="text-gray-300 text-xs drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)]">Inner Journey</p>
          </motion.div>
          <motion.div 
            className="flex-1 text-center ml-8"
            animate={{ scale: hoveredRealm === 'yang' ? 1.1 : 1 }}
          >
            <p className="text-white font-bold text-xl drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">Yang</p>
            <p className="text-gray-300 text-xs drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)]">Physical Path</p>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
};