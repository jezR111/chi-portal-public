// src/features/yang/components/MountainProgress/index.tsx
'use client';

import { motion } from 'framer-motion';
import { Flame } from 'lucide-react';

export default function MountainProgress() {
  // Example progress value (replace with real data as needed)
  const progress = 62;
  const milestones = [0, 20, 40, 60, 80, 100];

  return (
    <div className="bg-gradient-to-br from-orange-900/60 to-amber-900/60 rounded-2xl p-6 shadow-lg border border-orange-900/30 flex flex-col items-center relative overflow-hidden">
      <h3 className="text-lg font-bold text-orange-200 mb-4 flex items-center gap-2">
        <Flame className="w-5 h-5 text-orange-400 animate-pulse" />
        Mountain Progress
      </h3>
      <div className="w-full flex flex-col items-center">
        <svg viewBox="0 0 320 160" width="100%" height="120" className="mb-2">
          {/* Mountain shape */}
          <motion.path
            d="M0 140 L60 80 L120 120 L180 60 L240 100 L320 40"
            fill="none"
            stroke="#fbbf24"
            strokeWidth="6"
            strokeLinecap="round"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 1.5 }}
          />
          {/* Progress marker */}
          <motion.circle
            cx={progress * 3.2}
            cy={160 - (progress * 1.1)}
            r="10"
            fill="#ea580c"
            stroke="#fff7ed"
            strokeWidth="3"
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ repeat: Infinity, duration: 2 }}
          />
          {/* Milestone markers */}
          {milestones.map((m) => (
            <circle
              key={m}
              cx={m * 3.2}
              cy={160 - (m * 1.1)}
              r="6"
              fill="#fff7ed"
              stroke="#ea580c"
              strokeWidth="2"
              opacity={progress >= m ? 1 : 0.3}
            />
          ))}
        </svg>
        <div className="flex items-center gap-2 mt-2">
          <span className="text-orange-100 font-medium">Progress:</span>
          <span className="text-2xl font-bold text-orange-300 drop-shadow">{progress}%</span>
        </div>
      </div>
      {/* Floating ember particles */}
      <EmberParticles />
    </div>
  );
}

function EmberParticles() {
  const embers = Array.from({ length: 8 });
  return (
    <>
      {embers.map((_, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full bg-orange-400/60 blur-[2px] pointer-events-none"
          style={{
            width: `${Math.random() * 8 + 6}px`,
            height: `${Math.random() * 8 + 6}px`,
            left: `${Math.random() * 90 + 5}%`,
            bottom: `${Math.random() * 40 + 10}%`,
            opacity: Math.random() * 0.5 + 0.3,
          }}
          animate={{
            y: [0, -Math.random() * 60 - 30],
            opacity: [1, 0],
          }}
          transition={{
            duration: Math.random() * 2 + 2,
            repeat: Infinity,
            delay: Math.random() * 2,
            ease: 'easeOut',
          }}
        />
      ))}
    </>
  );
}
