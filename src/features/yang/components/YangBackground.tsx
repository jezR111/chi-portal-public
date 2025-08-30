// src/features/yang/components/YangBackground.tsx
'use client';

import { motion } from 'framer-motion';

export function YangBackground() {
  return (
    <div className="fixed inset-0 z-0">
      {/* Base gradient - Earth tones */}
      <div className="absolute inset-0 bg-gradient-to-br from-stone-950 via-amber-950 to-orange-950" />
      
      {/* Animated gradient overlay */}
      <motion.div
        className="absolute inset-0 opacity-30"
        animate={{
          background: [
            'radial-gradient(circle at 20% 80%, #ea580c 0%, transparent 50%)',
            'radial-gradient(circle at 80% 20%, #dc2626 0%, transparent 50%)',
            'radial-gradient(circle at 20% 80%, #ea580c 0%, transparent 50%)',
          ],
        }}
        transition={{ duration: 10, repeat: Infinity }}
      />
      
      {/* Rock texture overlay */}
      <div 
        className="absolute inset-0 opacity-10"
        style={{
          backgroundImage: 'url("/assets/yang/rock-texture.svg")',
          backgroundSize: '200px 200px',
        }}
      />
      
      {/* Energy lines */}
      <svg className="absolute inset-0 w-full h-full opacity-20">
        <defs>
          <pattern id="grid" width="50" height="50" patternUnits="userSpaceOnUse">
            <path d="M 50 0 L 0 0 0 50" fill="none" stroke="#f97316" strokeWidth="0.5" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#grid)" />
      </svg>
    </div>
  );
}

