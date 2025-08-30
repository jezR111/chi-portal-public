// src/features/yang/components/MountainProgress/MountainProgress.tsx
'use client';

import { motion } from 'framer-motion';
import { Flame, Star, Trophy, Zap } from 'lucide-react';

interface MountainProgressProps {
  currentLevel: number;
  totalLevels: number;
  experience?: number;
  nextLevelExp?: number;
}

export function MountainProgress({ 
  currentLevel, 
  totalLevels, 
  experience = 1250, 
  nextLevelExp = 2000 
}: MountainProgressProps) {
  const progress = (currentLevel / totalLevels) * 100;
  const expProgress = (experience / nextLevelExp) * 100;

  // Generate mountain path points
  const pathPoints = Array.from({ length: totalLevels }, (_, i) => ({
    level: i + 1,
    x: 20 + (i % 2 === 0 ? 60 : 20) * (i / totalLevels),
    y: 90 - (80 * ((i + 1) / totalLevels)),
    reached: i < currentLevel,
    current: i === currentLevel - 1,
  }));

  return (
    <div className="relative bg-gradient-to-b from-orange-900/10 to-red-900/10 backdrop-blur-xl rounded-2xl border border-orange-500/20 p-6 h-[500px] overflow-hidden">
      {/* Title */}
      <div className="absolute top-6 left-6 z-20">
        <h3 className="text-xl font-bold text-white mb-1">Mountain of Power</h3>
        <p className="text-orange-300/60 text-sm">Level {currentLevel} Warrior</p>
      </div>

      {/* Stats */}
      <div className="absolute top-6 right-6 z-20 text-right">
        <div className="text-2xl font-bold text-orange-400">{experience}</div>
        <div className="text-xs text-orange-300/60">/ {nextLevelExp} EXP</div>
        <div className="mt-2 w-32 h-2 bg-black/50 rounded-full overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${expProgress}%` }}
            className="h-full bg-gradient-to-r from-orange-500 to-yellow-500"
          />
        </div>
      </div>

      {/* Mountain SVG */}
      <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 100">
        <defs>
          <linearGradient id="mountainGradient" x1="0%" y1="100%" x2="0%" y2="0%">
            <stop offset="0%" stopColor="#7c2d12" />
            <stop offset="50%" stopColor="#92400e" />
            <stop offset="100%" stopColor="#fbbf24" />
          </linearGradient>
          <filter id="glow">
            <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
            <feMerge>
              <feMergeNode in="coloredBlur"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
        </defs>

        {/* Mountain Shape */}
        <path
          d="M 10,90 L 30,60 L 45,70 L 50,30 L 55,70 L 70,60 L 90,90 Z"
          fill="url(#mountainGradient)"
          opacity="0.3"
        />
        
        {/* Snow Cap */}
        {currentLevel > totalLevels * 0.7 && (
          <path
            d="M 45,40 L 50,30 L 55,40 Z"
            fill="white"
            opacity="0.8"
          />
        )}

        {/* Path Line */}
        <motion.polyline
          points={pathPoints.map(p => `${p.x},${p.y}`).join(' ')}
          fill="none"
          stroke="rgba(251, 191, 36, 0.3)"
          strokeWidth="2"
          strokeDasharray="5,5"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 2 }}
        />

        {/* Level Markers */}
        {pathPoints.map((point, index) => (
          <g key={point.level}>
            {/* Marker Circle */}
            <motion.circle
              cx={point.x}
              cy={point.y}
              r="4"
              fill={point.reached ? '#f97316' : point.current ? '#fbbf24' : '#1f2937'}
              stroke={point.current ? '#fbbf24' : '#f97316'}
              strokeWidth={point.current ? '2' : '1'}
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: index * 0.1 }}
              filter={point.current ? 'url(#glow)' : ''}
            />
            
            {/* Level Number */}
            <text
              x={point.x}
              y={point.y - 8}
              fill="white"
              fontSize="6"
              textAnchor="middle"
              className="font-bold"
            >
              {point.level}
            </text>
          </g>
        ))}

        {/* Summit Flag */}
        <g transform={`translate(${pathPoints[totalLevels - 1].x}, ${pathPoints[totalLevels - 1].y})`}>
          <line
            x1="0"
            y1="0"
            x2="0"
            y2="-10"
            stroke="#ef4444"
            strokeWidth="1"
          />
          <path
            d="M 0,-10 L 8,-7 L 0,-4 Z"
            fill="#ef4444"
          />
        </g>

        {/* Current Position Indicator */}
        {currentLevel > 0 && currentLevel <= totalLevels && (
          <motion.g
            transform={`translate(${pathPoints[currentLevel - 1].x}, ${pathPoints[currentLevel - 1].y})`}
            animate={{ y: [0, -2, 0] }}
            transition={{ repeat: Infinity, duration: 2 }}
          >
            <circle r="6" fill="#fbbf24" opacity="0.5" />
            <circle r="3" fill="#f97316" />
          </motion.g>
        )}
      </svg>

      {/* Milestone Badges */}
      <div className="absolute bottom-6 left-6 right-6 z-20">
        <div className="flex justify-between items-center">
          {[
            { level: 3, icon: Zap, label: 'Spark' },
            { level: 5, icon: Flame, label: 'Fire' },
            { level: 8, icon: Star, label: 'Star' },
            { level: 10, icon: Trophy, label: 'Peak' },
          ].map((milestone) => (
            <motion.div
              key={milestone.level}
              whileHover={{ scale: 1.1 }}
              className={`flex flex-col items-center ${
                currentLevel >= milestone.level ? 'opacity-100' : 'opacity-30'
              }`}
            >
              <div className={`p-2 rounded-full ${
                currentLevel >= milestone.level 
                  ? 'bg-orange-500/20 border border-orange-500/50' 
                  : 'bg-gray-800/50 border border-gray-700'
              }`}>
                <milestone.icon className={`w-5 h-5 ${
                  currentLevel >= milestone.level ? 'text-orange-400' : 'text-gray-500'
                }`} />
              </div>
              <span className="text-xs mt-1 text-gray-400">{milestone.label}</span>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Floating Embers Animation */}
      <div className="absolute inset-0 pointer-events-none">
        {[...Array(10)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-orange-400 rounded-full"
            initial={{
              x: Math.random() * 100,
              y: 100,
              opacity: 0,
            }}
            animate={{
              y: -10,
              opacity: [0, 1, 0],
            }}
            transition={{
              duration: Math.random() * 5 + 5,
              repeat: Infinity,
              delay: Math.random() * 5,
              ease: 'easeOut',
            }}
            style={{ left: `${Math.random() * 100}%` }}
          />
        ))}
      </div>
    </div>
  );
}

// Export other name variants for flexibility
export { MountainProgress as MountainClimb };
export default MountainProgress;
