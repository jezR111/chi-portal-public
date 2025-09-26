import { AnimatePresence, motion } from 'framer-motion';
import { Flame, Search, Sparkles, Trophy, X } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { challengesData, questsData } from '../../../data/questsData';
import { useXPDisplay } from '../../../hooks/useXPDisplay';
import { xpService } from '../../../services/xpService';
import { Challenge, Quest } from '../../../types/quest.types';
import ChallengeCard from './ChallengeCard';
import QuestCard from './QuestCard';

interface QuestSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  onQuestComplete?: (questId: string, xpEarned: number) => void;
  onChallengeProgress?: (challengeId: string) => void;
}

type TabType = 'quests' | 'challenges';

export default function QuestSidebar({ 
  isOpen, 
  onClose, 
  onQuestComplete,
  onChallengeProgress 
}: QuestSidebarProps) {
  const [activeTab, setActiveTab] = useState<TabType>('quests');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [quests, setQuests] = useState<Quest[]>([]);
  const [challenges, setChallenges] = useState<Challenge[]>([]);
  const [completedToday, setCompletedToday] = useState<string[]>([]);
  const [dailyStreak, setDailyStreak] = useState(0);
  
  // Use the new XP hooks/service
  const { totalXP } = useXPDisplay();
  const currentXP = totalXP;

  // Load saved state from localStorage
  useEffect(() => {
    const loadQuestState = () => {
      const saved = localStorage.getItem('questState');
      if (saved) {
        const state = JSON.parse(saved);
        setCompletedToday(state.completedToday || []);
        setDailyStreak(state.currentDailyStreak || 0);
        
        // Check if it's a new day and reset
        const lastActive = new Date(state.lastActiveDate);
        const today = new Date();
        if (lastActive.toDateString() !== today.toDateString()) {
          setCompletedToday([]);
          // Check if streak should continue
          const daysDiff = Math.floor((today.getTime() - lastActive.getTime()) / (1000 * 60 * 60 * 24));
          if (daysDiff > 1) {
            setDailyStreak(0);
          }
        }
      }
      
      // Initialize quests with unlock status based on XP
      const unlockedQuests = questsData.map(quest => ({
        ...quest,
        available: quest.available || (quest.unlockAtXP ? currentXP >= quest.unlockAtXP : false),
        completedToday: completedToday.includes(quest.id)
      }));
      setQuests(unlockedQuests);
      
      // Load challenge progress
      const savedChallenges = localStorage.getItem('challengeProgress');
      if (savedChallenges) {
        setChallenges(JSON.parse(savedChallenges));
      } else {
        setChallenges(challengesData);
      }
    };
    
    loadQuestState();
  }, [currentXP]);

  // Save state to localStorage
  const saveQuestState = () => {
    const state = {
      completedToday,
      currentDailyStreak: dailyStreak,
      lastActiveDate: new Date().toISOString(),
      totalQuestsCompleted: completedToday.length
    };
    localStorage.setItem('questState', JSON.stringify(state));
    localStorage.setItem('challengeProgress', JSON.stringify(challenges));
  };

  useEffect(() => {
    saveQuestState();
  }, [completedToday, dailyStreak, challenges]);

  // Filter quests based on search and category
  const filteredQuests = useMemo(() => {
    return quests.filter(quest => {
      const matchesSearch = quest.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           quest.description.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = selectedCategory === 'all' || quest.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [quests, searchQuery, selectedCategory]);

  // Calculate daily quest limit (MVP: 3 per day, can expand later)
  const dailyQuestLimit = 3 + Math.floor(currentXP / 500); // +1 slot per 500 XP
  const questsRemainingToday = Math.max(0, dailyQuestLimit - completedToday.length);

  // Handle quest completion
  const handleQuestComplete = (questId: string) => {
    const quest = quests.find(q => q.id === questId);
    if (!quest || quest.completedToday) return;

    // Calculate XP with modifiers
    let xpEarned = quest.xpReward;
    const now = new Date();
    const currentHour = now.getHours();
    const currentMinute = now.getMinutes();
    const currentTime = `${currentHour.toString().padStart(2, '0')}:${currentMinute.toString().padStart(2, '0')}`;

    // Apply time bonuses
    if (quest.modifiers?.morningBonus && currentTime < quest.modifiers.morningBonus.before) {
      xpEarned = Math.floor(xpEarned * quest.modifiers.morningBonus.multiplier);
    }

    // Apply streak bonus
    if (quest.modifiers?.streakBonus && dailyStreak > 0) {
      xpEarned += Math.min(dailyStreak * 2, 20); // +2 XP per day, max 20
    }

    // Update state
    setCompletedToday([...completedToday, questId]);
    setQuests(quests.map(q => 
      q.id === questId ? { ...q, completedToday: true, lastCompleted: new Date().toISOString() } : q
    ));

    // Award XP using the new service
    xpService.addXP(xpEarned, 'quests', { questId });

    // Update challenges if this quest counts
    const updatedChallenges = challenges.map(challenge => {
      if (challenge.questIds?.includes(questId)) {
        const newProgress = challenge.currentProgress + 1;
        if (challenge.type === 'streak') {
          return {
            ...challenge,
            currentProgress: newProgress,
            currentStreak: (challenge.currentStreak || 0) + 1,
            lastProgressAt: new Date().toISOString()
          };
        }
        return {
          ...challenge,
          currentProgress: newProgress
        };
      }
      return challenge;
    });
    setChallenges(updatedChallenges);

    // Trigger callback
    onQuestComplete?.(questId, xpEarned);
  };

  // Calculate stats for header
  const todayXP = completedToday.reduce((total, questId) => {
    const quest = quests.find(q => q.id === questId);
    return total + (quest?.xpReward || 0);
  }, 0);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
            onClick={onClose}
          />

          {/* Sidebar */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="fixed right-0 top-0 h-full w-full sm:w-[420px] bg-gradient-to-b from-gray-900 via-purple-900/20 to-gray-900 backdrop-blur-xl z-50 shadow-2xl border-l border-purple-500/20"
          >
            {/* Header */}
            <div className="p-6 border-b border-purple-500/20">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg">
                    <Sparkles className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-white">Daily Quests</h2>
                    <p className="text-sm text-purple-300">
                      {questsRemainingToday} remaining today
                    </p>
                  </div>
                </div>
                <button
                  onClick={onClose}
                  className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5 text-gray-400" />
                </button>
              </div>

              {/* Stats Bar */}
              <div className="grid grid-cols-3 gap-3">
                <div className="bg-purple-500/10 rounded-lg p-2 text-center border border-purple-500/20">
                  <p className="text-xs text-purple-300">Today's XP</p>
                  <p className="text-lg font-bold text-white">{todayXP}</p>
                </div>
                <div className="bg-orange-500/10 rounded-lg p-2 text-center border border-orange-500/20">
                  <p className="text-xs text-orange-300">Streak</p>
                  <p className="text-lg font-bold text-white flex items-center justify-center gap-1">
                    {dailyStreak} <Flame className="w-4 h-4 text-orange-400" />
                  </p>
                </div>
                <div className="bg-green-500/10 rounded-lg p-2 text-center border border-green-500/20">
                  <p className="text-xs text-green-300">Completed</p>
                  <p className="text-lg font-bold text-white">{completedToday.length}</p>
                </div>
              </div>
            </div>

            {/* Tabs */}
            <div className="flex border-b border-purple-500/20">
              <button
                onClick={() => setActiveTab('quests')}
                className={`flex-1 px-6 py-3 text-sm font-medium transition-all ${
                  activeTab === 'quests'
                    ? 'text-white bg-purple-500/20 border-b-2 border-purple-400'
                    : 'text-gray-400 hover:text-white hover:bg-white/5'
                }`}
              >
                <div className="flex items-center justify-center gap-2">
                  <Sparkles className="w-4 h-4" />
                  Quests
                  {questsRemainingToday > 0 && (
                    <span className="px-2 py-0.5 bg-purple-500/30 rounded-full text-xs">
                      {questsRemainingToday}
                    </span>
                  )}
                </div>
              </button>
              <button
                onClick={() => setActiveTab('challenges')}
                className={`flex-1 px-6 py-3 text-sm font-medium transition-all ${
                  activeTab === 'challenges'
                    ? 'text-white bg-purple-500/20 border-b-2 border-purple-400'
                    : 'text-gray-400 hover:text-white hover:bg-white/5'
                }`}
              >
                <div className="flex items-center justify-center gap-2">
                  <Trophy className="w-4 h-4" />
                  Challenges
                </div>
              </button>
            </div>

            {/* Search & Filter (Quest tab only) */}
            {activeTab === 'quests' && (
              <div className="p-4 space-y-3 border-b border-purple-500/20">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search quests..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 bg-white/5 border border-purple-500/20 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-purple-400 transition-colors"
                  />
                </div>
                
                {/* Category filter pills */}
                <div className="flex gap-2 overflow-x-auto pb-1">
                  {['all', 'mind', 'body', 'spirit', 'heart', 'shadow'].map(cat => (
                    <button
                      key={cat}
                      onClick={() => setSelectedCategory(cat)}
                      className={`px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap transition-all ${
                        selectedCategory === cat
                          ? 'bg-purple-500 text-white'
                          : 'bg-white/5 text-gray-400 hover:bg-white/10'
                      }`}
                    >
                      {cat.charAt(0).toUpperCase() + cat.slice(1)}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {activeTab === 'quests' ? (
                <>
                  {filteredQuests.map(quest => (
                    <QuestCard
                      key={quest.id}
                      quest={quest}
                      onComplete={() => handleQuestComplete(quest.id)}
                      disabled={questsRemainingToday === 0 && !quest.completedToday}
                      currentXP={currentXP}
                    />
                  ))}
                </>
              ) : (
                <>
                  {challenges.map(challenge => (
                    <ChallengeCard
                      key={challenge.id}
                      challenge={challenge}
                      onProgress={() => onChallengeProgress?.(challenge.id)}
                    />
                  ))}
                </>
              )}
            </div>

            {/* Footer Tip */}
            <div className="p-4 border-t border-purple-500/20 bg-purple-500/5">
              <p className="text-xs text-purple-300 text-center">
                💡 Complete quests daily to maintain your streak and earn bonus XP!
              </p>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}