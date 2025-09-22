// src/features/yin/components/quests/QuestView.tsx

import { motion } from 'framer-motion';
import {
  Brain,
  Clock,
  Flame,
  Heart,
  Lock,
  Play,
  Star,
  Target,
  Trophy,
  Zap
} from 'lucide-react';
import React, { useState } from 'react';
import { ChallengesView } from './ChallengesView';
import { GratitudeQuest } from './GratitudeQuest';
import { MeditationQuest } from './MeditationQuest';

const QUESTS = [
  {
    id: '1',
    title: 'Morning Stillness',
    description: 'Begin your day with 10 minutes of peaceful meditation',
    xp: 15,
    duration: 10,
    type: 'meditation',
    category: 'mind',
    icon: Brain,
    gradient: 'from-purple-600 to-indigo-600',
    shadowColor: 'shadow-purple-500/30'
  },
  {
    id: '2',
    title: 'Gratitude Practice',
    description: 'Write down 5 things you\'re grateful for today',
    xp: 8,
    duration: 5,
    type: 'gratitude',
    category: 'heart',
    icon: Heart,
    gradient: 'from-pink-600 to-rose-600',
    shadowColor: 'shadow-pink-500/30'
  },
  {
    id: '3',
    title: 'Conscious Movement',
    description: 'Take a 20-minute walk with full presence',
    xp: 18,
    duration: 20,
    type: 'movement',
    category: 'body',
    icon: Zap,
    gradient: 'from-green-600 to-emerald-600',
    shadowColor: 'shadow-green-500/30'
  }
];

export const QuestView: React.FC = () => {
  const [activeQuest, setActiveQuest] = useState<any>(null);
  const [completedQuests, setCompletedQuests] = useState<string[]>([]);
  const [totalXP, setTotalXP] = useState(0);
  const [streak, setStreak] = useState(0);
  const [activeTab, setActiveTab] = useState<'quests' | 'challenges'>('quests');

  const handleQuestComplete = (questId: string, xp: number, data?: any) => {
    setCompletedQuests([...completedQuests, questId]);
    setTotalXP(totalXP + xp);
    setActiveQuest(null);
    
    const questData = {
      questId,
      completedAt: new Date().toISOString(),
      xpEarned: xp,
      data
    };
    const existing = JSON.parse(localStorage.getItem('completedQuests') || '[]');
    existing.push(questData);
    localStorage.setItem('completedQuests', JSON.stringify(existing));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900/20 to-gray-900 p-6">
      {/* Header Stats */}
      <div className="max-w-7xl mx-auto mb-8">
        <div className="bg-black/30 backdrop-blur-xl rounded-3xl p-6 border border-white/10">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold text-white mb-2">
                {activeTab === 'quests' ? 'Daily Quests' : 'Challenges'}
              </h1>
              <p className="text-gray-400">
                {activeTab === 'quests' 
                  ? 'Complete quests to earn XP and build your streak'
                  : 'Push your limits and earn rewards'}
              </p>
            </div>
            
            <div className="flex gap-6">
              <div className="text-center">
                <div className="flex items-center gap-2 mb-1">
                  <Trophy className="w-5 h-5 text-amber-400" />
                  <span className="text-2xl font-bold text-white">{totalXP}</span>
                </div>
                <p className="text-xs text-gray-400">Today's XP</p>
              </div>
              
              <div className="text-center">
                <div className="flex items-center gap-2 mb-1">
                  <Flame className="w-5 h-5 text-orange-400" />
                  <span className="text-2xl font-bold text-orange-400">{streak}</span>
                </div>
                <p className="text-xs text-gray-400">Day Streak</p>
              </div>
              
              <div className="text-center">
                <div className="flex items-center gap-2 mb-1">
                  <Star className="w-5 h-5 text-green-400" />
                  <span className="text-2xl font-bold text-green-400">
                    {completedQuests.length}/{QUESTS.length}
                  </span>
                </div>
                <p className="text-xs text-gray-400">Completed</p>
              </div>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex gap-2">
            <button
              onClick={() => setActiveTab('quests')}
              className={`px-6 py-2 rounded-lg transition-all flex items-center gap-2 ${
                activeTab === 'quests'
                  ? 'bg-gradient-to-r from-purple-500/20 to-pink-500/20 text-white border border-purple-500/30'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              <Target className="w-4 h-4" />
              Quests
              <span className="bg-purple-500/20 px-2 py-0.5 rounded text-xs text-purple-300">3</span>
            </button>
            <button
              onClick={() => setActiveTab('challenges')}
              className={`px-6 py-2 rounded-lg transition-all flex items-center gap-2 ${
                activeTab === 'challenges'
                  ? 'bg-gradient-to-r from-purple-500/20 to-pink-500/20 text-white border border-purple-500/30'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              <Trophy className="w-4 h-4" />
              Challenges
            </button>
          </div>
        </div>
      </div>

      {/* Content based on active tab */}
      {activeTab === 'quests' ? (
        /* Quest Grid */
        <div className="max-w-7xl mx-auto grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {QUESTS.map((quest, index) => {
            const Icon = quest.icon;
            const isCompleted = completedQuests.includes(quest.id);
            
            return (
              <motion.div
                key={quest.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ y: -5 }}
                className="relative group"
              >
                <div className={`
                  relative bg-black/40 backdrop-blur-sm rounded-2xl p-6 
                  border border-white/10 hover:border-purple-500/30 transition-all
                  ${isCompleted ? 'opacity-50' : ''}
                `}>
                  {/* Completion overlay */}
                  {isCompleted && (
                    <div className="absolute inset-0 bg-green-500/10 rounded-2xl flex items-center justify-center">
                      <div className="bg-green-500 text-white px-4 py-2 rounded-full font-bold">
                        ✓ COMPLETED
                      </div>
                    </div>
                  )}

                  {/* Quest Content */}
                  <div className="flex items-start gap-4 mb-4">
                    <motion.div
                      whileHover={{ rotate: 5 }}
                      className={`
                        w-16 h-16 bg-gradient-to-br ${quest.gradient} 
                        rounded-2xl flex items-center justify-center
                        ${quest.shadowColor} shadow-lg
                      `}
                    >
                      <Icon className="w-8 h-8 text-white" />
                    </motion.div>
                    
                    <div className="flex-1">
                      <h3 className="text-xl font-bold text-white mb-1">{quest.title}</h3>
                      <p className="text-gray-400 text-sm">{quest.description}</p>
                    </div>
                  </div>

                  {/* Quest Info */}
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-4 text-sm">
                      <span className="flex items-center gap-1 text-amber-400">
                        <Zap className="w-4 h-4" />
                        {quest.xp} XP
                      </span>
                      <span className="flex items-center gap-1 text-gray-400">
                        <Clock className="w-4 h-4" />
                        {quest.duration} min
                      </span>
                    </div>
                  </div>

                  {/* Progress Bar */}
                  <div className="h-2 bg-black/50 rounded-full overflow-hidden mb-4">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: isCompleted ? '100%' : '0%' }}
                      className={`h-full bg-gradient-to-r ${quest.gradient}`}
                    />
                  </div>

                  {/* Start Button */}
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => !isCompleted && setActiveQuest(quest)}
                    disabled={isCompleted}
                    className={`
                      w-full py-3 rounded-xl font-semibold transition-all
                      flex items-center justify-center gap-2
                      ${isCompleted 
                        ? 'bg-gray-700 text-gray-500 cursor-not-allowed' 
                        : `bg-gradient-to-r ${quest.gradient} text-white hover:shadow-lg`
                      }
                    `}
                  >
                    {isCompleted ? (
                      <>
                        <Lock className="w-4 h-4" />
                        Completed
                      </>
                    ) : (
                      <>
                        <Play className="w-4 h-4" />
                        Start Quest
                      </>
                    )}
                  </motion.button>
                </div>

                {/* Glow effect on hover */}
                <div className={`
                  absolute inset-0 bg-gradient-to-r ${quest.gradient} 
                  rounded-2xl opacity-0 group-hover:opacity-20 blur-xl transition-opacity -z-10
                `} />
              </motion.div>
            );
          })}
        </div>
      ) : (
        /* Challenges View */
        <ChallengesView />
      )}

      {/* Active Quest Modal */}
      {activeQuest && (
        <div className="fixed inset-0 z-50">
          {activeQuest.type === 'meditation' && (
            <MeditationQuest 
              quest={activeQuest} 
              onComplete={handleQuestComplete}
              onClose={() => setActiveQuest(null)}
            />
          )}
          {activeQuest.type === 'gratitude' && (
            <GratitudeQuest 
              quest={activeQuest} 
              onComplete={handleQuestComplete}
              onClose={() => setActiveQuest(null)}
            />
          )}
        </div>
      )}
    </div>
  );
};