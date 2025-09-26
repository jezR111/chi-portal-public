import { motion } from 'framer-motion';
import {
  Brain,
  CheckCircle,
  Clock,
  Heart,
  Moon, Sun,
  Wind
} from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { challengeService } from '../../../services/challengeService';
import { xpService } from '../../../services/xpService';
import { XPActivity } from '../../../types/xp.types';
import { GratitudeQuest } from './GratitudeQuest';
import { MeditationQuest } from './MeditationQuest';

interface Quest {
  id: string;
  title: string;
  description: string;
  type: 'meditation' | 'gratitude' | 'movement' | 'insight' | 'shadow-work' | 'reflection' | 'daily';
  xp: number;
  duration?: number;
  difficulty: 'easy' | 'medium' | 'hard';
  category: string;
  icon: React.ReactNode;
  color: string;
  completed?: boolean;
  locked?: boolean;
}

// Limited to 5 premium quests
const PREMIUM_QUESTS: Quest[] = [
  {
    id: 'morning-meditation',
    title: 'Morning Meditation',
    description: 'Mindful breathing',
    type: 'meditation',
    xp: 25,
    duration: 1, // Start at 1 minute
    difficulty: 'easy',
    category: 'Mindfulness',
    icon: <Sun className="w-6 h-6" />,
    color: 'from-amber-500 to-orange-500'
  },
  {
    id: 'gratitude-practice',
    title: 'Gratitude Practice',
    description: 'List 5 gratitudes',
    type: 'gratitude',
    xp: 20,
    difficulty: 'easy',
    category: 'Reflection',
    icon: <Heart className="w-6 h-6" />,
    color: 'from-pink-500 to-rose-500'
  },
  {
    id: 'shadow-work',
    title: 'Shadow Work',
    description: 'Integrate emotions',
    type: 'shadow-work',
    xp: 40,
    difficulty: 'hard',
    category: 'Shadow',
    icon: <Moon className="w-6 h-6" />,
    color: 'from-purple-600 to-indigo-600'
  },
  {
    id: 'mindful-movement',
    title: 'Mindful Movement',
    description: '10 min stretching',
    type: 'movement',
    xp: 25,
    duration: 10,
    difficulty: 'easy',
    category: 'Embodiment',
    icon: <Wind className="w-6 h-6" />,
    color: 'from-green-500 to-teal-500'
  },
  {
    id: 'capture-insight',
    title: 'Capture Insight',
    description: 'Document learning',
    type: 'insight',
    xp: 35,
    difficulty: 'medium',
    category: 'Wisdom',
    icon: <Brain className="w-6 h-6" />,
    color: 'from-blue-500 to-cyan-500'
  }
];

export const QuestView: React.FC = () => {
  const [quests, setQuests] = useState<Quest[]>(PREMIUM_QUESTS);
  const [activeQuest, setActiveQuest] = useState<Quest | null>(null);
  const [activeTab, setActiveTab] = useState<'quests' | 'challenges'>('quests');
  const [meditationDuration, setMeditationDuration] = useState<Record<string, number>>({});
  const [lastMeditationDate, setLastMeditationDate] = useState<string>('');

  useEffect(() => {
    loadQuestProgress();
    loadMeditationProgress();
  }, []);

  const loadMeditationProgress = () => {
    const saved = localStorage.getItem('meditationProgress');
    if (saved) {
      const data = JSON.parse(saved);
      setMeditationDuration(data.durations || { 'morning-meditation': 1 });
      setLastMeditationDate(data.lastDate || '');
      
      // Adjust duration based on streak/misses
      const today = new Date().toDateString();
      const lastDate = data.lastDate ? new Date(data.lastDate).toDateString() : '';
      const daysSinceLastMeditation = Math.floor(
        (new Date().getTime() - new Date(lastDate).getTime()) / (1000 * 60 * 60 * 24)
      );
      
      if (daysSinceLastMeditation > 1) {
        // Decrease by 50% for each missed day
        const newDuration = Math.max(1, 
          (data.durations['morning-meditation'] || 1) * Math.pow(0.5, daysSinceLastMeditation - 1)
        );
        setMeditationDuration(prev => ({
          ...prev,
          'morning-meditation': Math.round(newDuration)
        }));
      }
    } else {
      setMeditationDuration({ 'morning-meditation': 1 });
    }
  };

  const loadQuestProgress = () => {
    const today = new Date().toDateString();
    const todayCompleted = JSON.parse(localStorage.getItem(`quests_${today}`) || '[]');
    
    setQuests(prevQuests => 
      prevQuests.map(quest => ({
        ...quest,
        completed: todayCompleted.includes(quest.id)
      }))
    );
  };

  const handleQuestStart = (quest: Quest) => {
    if (quest.type === 'meditation') {
      // Set duration from saved progress
      const duration = meditationDuration[quest.id] || 1;
      setActiveQuest({ ...quest, duration });
    } else {
      setActiveQuest(quest);
    }
  };

  const handleQuestComplete = async (questId: string, baseXP: number, questData?: any) => {
    const quest = quests.find(q => q.id === questId);
    if (!quest) return;

    // Handle meditation duration increase
    if (quest.type === 'meditation') {
      const currentDuration = meditationDuration[questId] || 1;
      const newDuration = Math.round(currentDuration * 1.5); // Increase by 50%
      
      const progressData = {
        durations: { ...meditationDuration, [questId]: newDuration },
        lastDate: new Date().toDateString()
      };
      
      localStorage.setItem('meditationProgress', JSON.stringify(progressData));
      setMeditationDuration(prev => ({ ...prev, [questId]: newDuration }));
      setLastMeditationDate(new Date().toDateString());
    }

    // Create activity for XP
    const activity: XPActivity = {
      type: quest.type as any,
      timestamp: Date.now(),
      duration: quest.duration ? quest.duration * 60000 : 0,
      data: {
        questId,
        streakDays: xpService.getStreak(),
        isFirstTime: !localStorage.getItem(`quest_${questId}_ever_completed`),
        ...questData
      }
    };

    const xpResult = xpService.addActivityXP(activity);
    
    // Update quest status
    const today = new Date().toDateString();
    const todayCompleted = JSON.parse(localStorage.getItem(`quests_${today}`) || '[]');
    if (!todayCompleted.includes(questId)) {
      todayCompleted.push(questId);
      localStorage.setItem(`quests_${today}`, JSON.stringify(todayCompleted));
    }
    
    localStorage.setItem(`quest_${questId}_ever_completed`, 'true');
    
    setQuests(prevQuests => 
      prevQuests.map(q => 
        q.id === questId ? { ...q, completed: true } : q
      )
    );
    
    setActiveQuest(null);
  };

  const completedCount = quests.filter(q => q.completed).length;
  const totalXPEarned = quests.filter(q => q.completed).reduce((sum, q) => sum + q.xp, 0);
  const availableChallenges = challengeService.getAvailableChallenges();

  return (
    <div className="min-h-screen p-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent mb-2">
          Daily Quests
        </h1>
        <p className="text-purple-300/70">Complete quests to earn XP and unlock new challenges</p>
        
        {/* Stats */}
        <div className="flex gap-4 mt-4">
          <div className="bg-purple-900/30 rounded-lg px-4 py-2 border border-purple-500/20">
            <span className="text-purple-400 text-sm">Today's Progress</span>
            <p className="text-white font-bold">{completedCount} / {quests.length}</p>
          </div>
          <div className="bg-amber-900/30 rounded-lg px-4 py-2 border border-amber-500/20">
            <span className="text-amber-400 text-sm">XP Earned</span>
            <p className="text-white font-bold">+{totalXPEarned} XP</p>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-6">
        <button
          onClick={() => setActiveTab('quests')}
          className={`px-6 py-2 rounded-lg font-medium transition-all ${
            activeTab === 'quests'
              ? 'bg-purple-600 text-white'
              : 'bg-purple-900/30 text-purple-300 hover:bg-purple-900/50'
          }`}
        >
          Quests
        </button>
        <button
          onClick={() => setActiveTab('challenges')}
          className={`px-6 py-2 rounded-lg font-medium transition-all ${
            activeTab === 'challenges'
              ? 'bg-purple-600 text-white'
              : 'bg-purple-900/30 text-purple-300 hover:bg-purple-900/50'
          }`}
        >
          Challenges
        </button>
      </div>

      {/* Content */}
      {activeTab === 'quests' ? (
        /* Premium Quest Cards */
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {quests.map((quest) => (
            <motion.div
              key={quest.id}
              whileHover={{ scale: quest.completed ? 1 : 1.02, y: -4 }}
              className="relative"
            >
              <div 
                className={`
                  h-32 rounded-2xl p-6 cursor-pointer transition-all
                  bg-gradient-to-br ${quest.color}
                  ${quest.completed ? 'opacity-60' : 'hover:shadow-2xl hover:shadow-purple-500/20'}
                  border border-white/10
                `}
                onClick={() => !quest.completed && handleQuestStart(quest)}
              >
                {/* Completion Badge */}
                {quest.completed && (
                  <div className="absolute -top-3 -right-3 bg-green-500 rounded-full p-2 shadow-lg">
                    <CheckCircle className="w-5 h-5 text-white" />
                  </div>
                )}

                {/* Content */}
                <div className="flex items-center justify-between h-full">
                  <div className="flex-1">
                    <h3 className="text-white font-bold text-lg mb-1">{quest.title}</h3>
                    <p className="text-white/80 text-sm">{quest.description}</p>
                    <div className="flex items-center gap-3 mt-2">
                      <span className="text-yellow-300 font-bold">+{quest.xp} XP</span>
                      {quest.duration && (
                        <span className="text-white/70 text-sm flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {quest.type === 'meditation' 
                            ? meditationDuration[quest.id] || quest.duration
                            : quest.duration}m
                        </span>
                      )}
                      <span className={`text-xs px-2 py-0.5 rounded-full bg-black/20 text-white/90`}>
                        {quest.difficulty}
                      </span>
                    </div>
                  </div>
                  <div className="text-white/90">
                    {quest.icon}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      ) : (
        /* Challenges Tab */
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {availableChallenges.map((challenge) => (
            <div
              key={challenge.id}
              className="bg-purple-900/30 rounded-xl p-4 border border-purple-500/30"
            >
              <h3 className="text-white font-semibold mb-2">{challenge.name}</h3>
              <p className="text-purple-300 text-sm mb-3">{challenge.description}</p>
              <div className="flex justify-between items-center">
                <span className="text-amber-400 font-bold">+{challenge.xp} XP</span>
                <span className={`text-xs px-2 py-1 rounded-full ${
                  challenge.difficulty === 'beginner' ? 'bg-green-900/50 text-green-400' :
                  challenge.difficulty === 'intermediate' ? 'bg-amber-900/50 text-amber-400' :
                  'bg-red-900/50 text-red-400'
                }`}>
                  {challenge.difficulty}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Active Quest Modals */}
      {activeQuest && (
        <>
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
        </>
      )}
    </div>
  );
};

export default QuestView;