// src/features/yin/components/quests-and-challenges/challenges/ChallengeRequirements.tsx

import { Check, Circle } from 'lucide-react';
import React from 'react';

interface ChallengeRequirementsProps {
  requirements: Array<{
    questId: string;
    title: string;
    completed: boolean;
  }>;
}

export const ChallengeRequirements: React.FC<ChallengeRequirementsProps> = ({ 
  requirements 
}) => {
  const completedCount = requirements.filter(r => r.completed).length;
  const totalCount = requirements.length;

  return (
    <div className="mt-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-white/90">
          Requirements to Complete:
        </h3>
        <span className="text-sm text-white/60">
          {completedCount} / {totalCount}
        </span>
      </div>

      <div className="space-y-3">
        {requirements.map((req, index) => (
          <div 
            key={index}
            className="flex items-center justify-between p-3 rounded-xl bg-white/5 border border-white/10"
          >
            <div className="flex items-center gap-3">
              {req.completed ? (
                <div className="w-6 h-6 bg-green-500/20 rounded-full flex items-center justify-center">
                  <Check className="w-4 h-4 text-green-400" />
                </div>
              ) : (
                <div className="w-6 h-6 border-2 border-white/30 rounded-full flex items-center justify-center">
                  <Circle className="w-4 h-4 text-white/40" />
                </div>
              )}
              
              <span className={`font-medium ${
                req.completed ? 'text-white/50 line-through' : 'text-white/90'
              }`}>
                Complete "{req.title}" quest
              </span>
            </div>

            <span className={`text-sm px-3 py-1 rounded-full ${
              req.completed 
                ? 'bg-green-500/20 text-green-400 border border-green-500/30' 
                : 'bg-white/10 text-white/60 border border-white/20'
            }`}>
              {req.completed ? 'Completed' : 'Not yet started'}
            </span>
          </div>
        ))}
      </div>

      {completedCount < totalCount && (
        <p className="mt-4 text-sm text-white/50 text-center">
          Complete {totalCount - completedCount} more {totalCount - completedCount === 1 ? 'quest' : 'quests'} to unlock reward
        </p>
      )}
    </div>
  );
};