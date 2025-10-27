// /features/yin/components/apps/community/WallOfInsights.tsx
import { InsightSyncService } from '@/features/yin/services/insightSyncService';
import { createClient } from '@/lib/db/supabase/client';
import { AnimatePresence, motion } from 'framer-motion';
import {
  BookOpen,
  Brain,
  ChevronDown,
  Cloud,
  CloudOff,
  Feather,
  Heart,
  Plus,
  RefreshCw,
  Sparkles,
  Target,
  TrendingUp,
  X
} from 'lucide-react';
import { useEffect, useRef, useState } from 'react';

interface Insight {
  id: string;
  user_id: string;
  username: string;
  insight: string;
  category: string;
  created_at: string;
}

// Premium Custom Dropdown Component
const CustomDropdown = ({ categories, selected, onSelect, getCategoryDetails }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const selectedCategoryDetails = getCategoryDetails(selected);
  const SelectedIcon = selectedCategoryDetails.icon;

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [dropdownRef]);
  
  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between bg-gradient-to-b from-amber-50 to-amber-100 text-amber-900 px-5 py-3.5 rounded-xl border border-amber-400 hover:border-amber-500 focus:border-amber-600 focus:outline-none focus:ring-2 focus:ring-amber-500/30 transition-all shadow-sm hover:shadow-md"
        style={{ fontFamily: 'Georgia, serif' }}
      >
        <span className="flex items-center gap-3">
          <SelectedIcon className="w-5 h-5 text-amber-700" />
          <span className="font-medium">{selectedCategoryDetails.name}</span>
        </span>
        <motion.div animate={{ rotate: isOpen ? 180 : 0 }} transition={{ duration: 0.2 }}>
          <ChevronDown className="w-5 h-5 text-amber-600" />
        </motion.div>
      </button>
      
      <AnimatePresence>
        {isOpen && (
          <motion.ul
            initial={{ opacity: 0, y: -5, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -5, scale: 0.98 }}
            transition={{ duration: 0.15 }}
            className="absolute z-20 w-full mt-2 bg-gradient-to-b from-amber-50 to-amber-100 border border-amber-400 rounded-xl shadow-xl overflow-hidden"
          >
            {categories
              .filter(c => c.id !== 'all' && c.id !== selected)
              .map(cat => {
                const CategoryIcon = cat.icon;
                
                return (
                  <motion.li 
                    key={cat.id}
                    whileHover={{ x: 2 }}
                    transition={{ duration: 0.1 }}
                  >
                    <button
                      onClick={() => {
                        onSelect(cat.id);
                        setIsOpen(false);
                      }}
                      className="w-full text-left flex items-center gap-3 px-5 py-3 text-amber-800 hover:bg-amber-500 hover:text-white transition-colors group"
                      style={{ fontFamily: 'Georgia, serif' }}
                    >
                      <CategoryIcon className="w-5 h-5 group-hover:text-white" />
                      <span className="font-medium">{cat.name}</span>
                    </button>
                  </motion.li>
                );
              })}
          </motion.ul>
        )}
      </AnimatePresence>
    </div>
  );
};

export default function WallOfInsights({ profile }: { profile: any }) {
  const [insights, setInsights] = useState<Insight[]>([]);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [showAddModal, setShowAddModal] = useState(false);
  const [newInsight, setNewInsight] = useState('');
  const [newCategory, setNewCategory] = useState('mindfulness');
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [syncStatus, setSyncStatus] = useState<'idle' | 'syncing' | 'synced'>('idle');
  
  const supabase = createClient();

  const categories = [
  { id: 'all', name: 'All Insights', icon: Sparkles, color: 'border-amber-600', accent: 'from-amber-600/20 to-amber-700/20' },
  { id: 'mindfulness', name: 'Mindfulness', icon: Brain, color: 'border-blue-600', accent: 'from-blue-600/20 to-blue-700/20' },
  { id: 'growth', name: 'Personal Growth', icon: TrendingUp, color: 'border-green-600', accent: 'from-green-600/20 to-green-700/20' },
  { id: 'relationships', name: 'Relationships', icon: Heart, color: 'border-pink-600', accent: 'from-pink-600/20 to-pink-700/20' },
  { id: 'purpose', name: 'Life Purpose', icon: Target, color: 'border-purple-600', accent: 'from-purple-600/20 to-purple-700/20' },
  { id: 'shadow', name: 'Shadow Work', icon: BookOpen, color: 'border-indigo-600', accent: 'from-indigo-600/20 to-indigo-700/20' },
  { id: 'captured', name: 'Captured Insights', icon: Sparkles, color: 'border-yellow-600', accent: 'from-yellow-600/20 to-yellow-700/20' },
];

  useEffect(() => {
    loadInsights();
    const subscription = subscribeToInsights();
    return () => {
      subscription?.unsubscribe();
    };
  }, [selectedCategory]);

  useEffect(() => {
    // Start sync service
    const syncService = InsightSyncService.getInstance();
    syncService.startSync();

    // Monitor online status
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);
    const handleInsightSynced = (e: CustomEvent) => {
      console.log('Insight synced:', e.detail);
      loadInsights(); // Reload to update UI
      setSyncStatus('synced');
      setTimeout(() => setSyncStatus('idle'), 3000);
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    window.addEventListener('insightSynced', handleInsightSynced as EventListener);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
      window.removeEventListener('insightSynced', handleInsightSynced as EventListener);
    };
  }, []);

  const loadInsights = async () => {
    let query = supabase
      .from('community_insights')
      .select('*')
      .order('created_at', { ascending: false });

    if (selectedCategory === 'all') {
    // Filter out captured insights from the all view
    query = query.neq('category', 'captured');
  } else if (selectedCategory !== 'all') {
    query = query.eq('category', selectedCategory);
  }

    const { data, error } = await query.limit(50);
    
    if (!error && data) {
      setInsights(data);
    }
  };

  const subscribeToInsights = () => {
    return supabase
      .channel('insights-wall')
      .on('postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'community_insights'
        },
        () => {
          loadInsights();
        }
      )
      .subscribe();
  };

  // Update submitInsight to use consistent format

const submitInsight = async () => {
  if (!newInsight.trim()) return;

  setIsSubmitting(true);
  
  // Create insight with consistent format
  const timestamp = Date.now();
  const random = Math.random().toString(36).substr(2, 9);
  const uniqueId = `wall-${timestamp}-${random}`;
  
  const localInsight = {
    id: uniqueId,
    username: isAnonymous ? 'Anonymous Seeker' : (profile?.username || 'Anonymous'),
    insight: newInsight.trim(), // Wall uses 'insight' field
    content: newInsight.trim(), // Also include 'content' for compatibility
    category: newCategory,
    created_at: new Date().toISOString(),
    timestamp: new Date().toISOString(), // Include both timestamp formats
    local: true,
    author: isAnonymous ? 'Anonymous Seeker' : (profile?.username || 'Anonymous')
  };
  
  try {
    // Save to localStorage first
    const existingWallPosts = JSON.parse(localStorage.getItem('wallOfInsights') || '[]');
    
    // Check for duplicates
    const isDuplicate = existingWallPosts.some((post: any) => 
      (post.insight === localInsight.insight || post.content === localInsight.content) &&
      Math.abs(new Date(post.created_at || post.timestamp).getTime() - new Date(localInsight.created_at).getTime()) < 5000
    );
    
    if (!isDuplicate) {
      existingWallPosts.unshift(localInsight);
      localStorage.setItem('wallOfInsights', JSON.stringify(existingWallPosts));
      
      // Trigger storage event
      window.dispatchEvent(new StorageEvent('storage', {
        key: 'wallOfInsights',
        newValue: JSON.stringify(existingWallPosts),
        url: window.location.href
      }));
    }
    
    // Try Supabase in background (non-blocking)
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    
    if (user) {
      supabase
        .from('community_insights')
        .insert({
          user_id: user.id,
          username: localInsight.username,
          insight: localInsight.insight,
          category: localInsight.category
        })
        .then(({ error }) => {
          if (!error) {
            console.log('Synced to Supabase');
          }
        });
    }
    
    setNewInsight('');
    setIsAnonymous(false);
    setShowAddModal(false);
    loadInsights(); // Reload to show new insight
    
  } catch (error) {
    console.error('Error submitting insight:', error);
  } finally {
    setIsSubmitting(false);
  }
};

  const getCategoryDetails = (categoryId: string) => {
    return categories.find(c => c.id === categoryId) || categories[0];
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.08,
        delayChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30, rotateX: -10 },
    visible: { 
      opacity: 1, 
      y: 0, 
      rotateX: 0,
      transition: {
        type: "spring",
        damping: 20,
        stiffness: 100
      }
    }
  };

  return (
    <div className="h-full flex flex-col bg-gradient-to-br from-amber-50 via-amber-50 to-yellow-50 text-amber-950 relative overflow-hidden">
      
      {/* Premium textured background */}
      <div 
        className="absolute inset-0 opacity-10 pointer-events-none"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='turbulence' baseFrequency='0.65' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' opacity='0.3'/%3E%3C/svg%3E")`,
          backgroundRepeat: 'repeat',
        }}
      />

      {/* Header with premium glass effect */}
      <header className="relative z-10 p-6 backdrop-blur-sm border-b border-amber-200 bg-gradient-to-br from-amber-50/80 via-white/60 to-amber-50/80">
        
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-gradient-to-br from-amber-600 to-amber-700 rounded-xl shadow-lg">
              <Feather className="w-7 h-7 text-amber-50" />
            </div>
            <div>
              <h3 className="text-3xl font-bold text-amber-900 tracking-wide" 
                style={{ 
                  fontFamily: 'Georgia, serif',
                  textShadow: '1px 1px 2px rgba(0,0,0,0.05)'
                }}
              >
                Wall of Wisdom
              </h3>
              <p className="text-sm text-amber-700/90 italic" style={{ fontFamily: 'Georgia, serif' }}>
                Timeless insights from our sacred community
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            {/* Sync Status Indicator */}
            <div className="flex items-center gap-2 px-3 py-1.5 bg-white/60 rounded-lg">
              {!isOnline ? (
                <>
                  <CloudOff className="w-4 h-4 text-amber-600" />
                  <span className="text-xs text-amber-700">Offline Mode</span>
                </>
              ) : syncStatus === 'syncing' ? (
                <>
                  <RefreshCw className="w-4 h-4 text-amber-600 animate-spin" />
                  <span className="text-xs text-amber-700">Syncing...</span>
                </>
              ) : syncStatus === 'synced' ? (
                <>
                  <Cloud className="w-4 h-4 text-green-600" />
                  <span className="text-xs text-green-700">Synced</span>
                </>
              ) : (
                <>
                  <Cloud className="w-4 h-4 text-amber-600" />
                  <span className="text-xs text-amber-700">Connected</span>
                </>
              )}
            </div>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowAddModal(true)}
              className="px-5 py-2.5 bg-gradient-to-r from-amber-700 to-amber-600 hover:from-amber-800 hover:to-amber-700 text-white rounded-lg shadow-lg hover:shadow-xl transition-all flex items-center gap-2 font-semibold"
              style={{ fontFamily: 'Georgia, serif' }}
            >
              <Plus className="w-5 h-5" />
              Inscribe Wisdom
            </motion.button>
          </div>
        </div>

        {/* Category Filter with enhanced styling */}
        <div className="flex gap-2 overflow-x-auto pb-2 -mx-8 px-8">
          {categories.map((cat, idx) => {
            const Icon = cat.icon;
            const isActive = selectedCategory === cat.id;
            return (
              <motion.button
                key={cat.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.03 }}
                whileHover={{ y: -2 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-4 py-2 rounded-lg flex items-center gap-2 whitespace-nowrap transition-all text-sm font-medium ${
                  isActive 
                    ? 'bg-amber-700 text-white shadow-lg' 
                    : 'bg-white/60 text-amber-800 hover:bg-white/80 shadow-sm hover:shadow-md'
                }`}
                style={{ fontFamily: 'Georgia, serif' }}
              >
                <Icon className="w-4 h-4" />
                <span>{cat.name}</span>
              </motion.button>
            );
          })}
        </div>
      </header>

      {/* Scrolls Container with parallax */}
      <main className="flex-1 overflow-y-auto p-6 relative">
        <motion.div 
          className="max-w-4xl mx-auto"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {insights.map((insight, index) => {
            const category = getCategoryDetails(insight.category);
            const CategoryIcon = category.icon;
            const isLocal = insight.local === true;

            return (
              <motion.div
                key={insight.id}
                variants={itemVariants}
                className="relative mb-8 group"
              >
                {/* Local indicator badge */}
                {isLocal && (
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="absolute -left-2 top-4 z-10"
                  >
                    <div className="flex items-center gap-1 bg-amber-100 text-amber-700 px-2 py-1 rounded-lg text-xs font-medium shadow-md">
                      <CloudOff className="w-3 h-3" />
                      <span>Saved locally</span>
                    </div>
                  </motion.div>
                )}

                {/* Scroll container with realistic paper effect */}
                <motion.div
                  whileHover={{ scale: 1.01, y: -2 }}
                  transition={{ type: "spring", stiffness: 300 }}
                  className="relative"
                  style={{
                    filter: 'drop-shadow(0 10px 30px rgba(139, 69, 19, 0.2))'
                  }}
                >
                  {/* Main scroll body with realistic paper texture */}
                  <div 
                    className="relative bg-gradient-to-b from-amber-50 via-amber-50 to-amber-100 border-y-4 border-amber-800/30 overflow-hidden"
                    style={{
                      background: `
                        linear-gradient(180deg, 
                          rgba(254, 243, 199, 0.9) 0%,
                          rgba(254, 249, 235, 0.95) 20%,
                          rgba(254, 249, 235, 0.95) 80%,
                          rgba(252, 233, 189, 0.9) 100%
                        )
                      `,
                      boxShadow: `
                        inset 0 2px 4px rgba(139, 69, 19, 0.1),
                        inset 0 -2px 4px rgba(139, 69, 19, 0.1)
                      `
                    }}
                  >
                    {/* Paper texture overlay */}
                    <div 
                      className="absolute inset-0 opacity-30 mix-blend-multiply"
                      style={{
                        backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='400' viewBox='0 0 400 400'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='turbulence' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' opacity='0.4'/%3E%3C/svg%3E")`,
                        backgroundSize: '200px 200px'
                      }}
                    />

                    {/* Aged stains and marks */}
                    <div className="absolute top-0 right-0 w-32 h-32 bg-amber-600/5 rounded-full filter blur-2xl" />
                    <div className="absolute bottom-0 left-0 w-24 h-24 bg-amber-700/5 rounded-full filter blur-2xl" />

                    {/* Content */}
                    <div className="relative px-16 py-12">
                      {/* Category icon watermark */}
                      <div className="absolute top-8 left-8 opacity-10">
                        <CategoryIcon className="w-16 h-16 text-amber-800" />
                      </div>

                      {/* Quote with elegant typography */}
                      <div className="max-w-4xl mx-auto text-center">
                        <div className="relative inline-block">
                          {/* Large decorative quotes */}
                          <span 
                            className="absolute -left-12 -top-4 text-7xl text-amber-600/20 select-none font-serif"
                          >
                            "
                          </span>
                          <span 
                            className="absolute -right-12 bottom-0 text-7xl text-amber-600/20 select-none font-serif rotate-180"
                          >
                            "
                          </span>
                          
                          {/* The actual quote */}
                          <p 
                            className="text-xl md:text-2xl leading-relaxed text-amber-900 italic px-12"
                            style={{ 
                              fontFamily: 'Georgia, serif',
                              letterSpacing: '0.01em'
                            }}
                          >
                            {insight.insight}
                          </p>
                        </div>

                        {/* Author section */}
                        <div className="mt-10">
                          <div className="inline-flex items-center gap-4 text-amber-800">
                            <div className="h-px w-12 bg-gradient-to-r from-transparent to-amber-600/40" />
                            <p className="text-sm font-semibold tracking-wider uppercase" style={{ fontFamily: 'Georgia, serif' }}>
                              {insight.username}
                            </p>
                            <div className="h-px w-12 bg-gradient-to-l from-transparent to-amber-600/40" />
                          </div>
                          <p className="text-xs text-amber-600 mt-2">
                            {new Date(insight.created_at).toLocaleDateString('en-US', { 
                              year: 'numeric', 
                              month: 'long', 
                              day: 'numeric' 
                            })}
                          </p>
                        </div>
                      </div>

                      {/* Category label */}
                      <div className="absolute bottom-4 right-6 flex items-center gap-2 text-amber-700/60">
                        <CategoryIcon className="w-4 h-4" />
                        <span className="text-xs font-medium" style={{ fontFamily: 'Georgia, serif' }}>
                          {getCategoryDetails(insight.category).name}
                        </span>
                      </div>
                    </div>

                    {/* Top and bottom worn edges */}
                    <div 
                      className="absolute top-0 left-0 right-0 h-1 opacity-40"
                      style={{
                        background: 'repeating-linear-gradient(90deg, transparent, transparent 10px, rgba(139, 69, 19, 0.1) 10px, rgba(139, 69, 19, 0.1) 20px)'
                      }}
                    />
                    <div 
                      className="absolute bottom-0 left-0 right-0 h-1 opacity-40"
                      style={{
                        background: 'repeating-linear-gradient(90deg, transparent, transparent 10px, rgba(139, 69, 19, 0.1) 10px, rgba(139, 69, 19, 0.1) 20px)'
                      }}
                    />
                  </div>

                  {/* Left scroll roll effect */}
                  <div 
                    className="absolute left-0 top-0 bottom-0 w-6"
                    style={{
                      background: `linear-gradient(to right, 
                        rgba(139, 69, 19, 0.2) 0%,
                        rgba(139, 69, 19, 0.15) 30%,
                        rgba(139, 69, 19, 0.05) 60%,
                        transparent 100%
                      )`,
                      borderRadius: '50% 0 0 50%',
                      transform: 'translateX(-50%)',
                      filter: 'blur(2px)'
                    }}
                  />

                  {/* Right scroll roll effect */}
                  <div 
                    className="absolute right-0 top-0 bottom-0 w-6"
                    style={{
                      background: `linear-gradient(to left, 
                        rgba(139, 69, 19, 0.2) 0%,
                        rgba(139, 69, 19, 0.15) 30%,
                        rgba(139, 69, 19, 0.05) 60%,
                        transparent 100%
                      )`,
                      borderRadius: '0 50% 50% 0',
                      transform: 'translateX(50%)',
                      filter: 'blur(2px)'
                    }}
                  />
                </motion.div>
              </motion.div>
            );
          })}
        </motion.div>
      </main>

      {/* Add Insight Modal - Premium Design */}
      <AnimatePresence>
        {showAddModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/70 backdrop-blur-md flex items-center justify-center z-50 p-4"
            onClick={() => setShowAddModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, y: 20, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              exit={{ scale: 0.9, y: 20, opacity: 0 }}
              transition={{ type: 'spring', damping: 25, stiffness: 250 }}
              className="bg-gradient-to-br from-amber-50 to-amber-100 rounded-xl p-8 max-w-lg w-full shadow-2xl"
              onClick={(e) => e.stopPropagation()}
              style={{ fontFamily: 'Georgia, serif' }}
            >
              <div className="relative">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-2xl font-bold text-amber-900">
                    Inscribe Your Wisdom
                  </h3>
                  <motion.button
                    whileHover={{ scale: 1.1, rotate: 90 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => setShowAddModal(false)}
                    className="p-1.5 rounded-full hover:bg-amber-200/50 transition-colors"
                  >
                    <X className="w-5 h-5 text-amber-700" />
                  </motion.button>
                </div>
                
                <textarea
                  value={newInsight}
                  onChange={(e) => setNewInsight(e.target.value)}
                  placeholder="Share a timeless truth..."
                  className="w-full h-32 bg-white/70 text-amber-950 placeholder-amber-600/50 p-4 rounded-lg border border-amber-300 focus:border-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-500/30 resize-none transition-all"
                  style={{ fontFamily: 'Georgia, serif' }}
                  autoFocus
                />

                <div className="mt-5">
                  <label className="text-sm text-amber-800 mb-2 block font-semibold">
                    Select a Scroll
                  </label>
                  <CustomDropdown 
                    categories={categories}
                    selected={newCategory}
                    onSelect={setNewCategory}
                    getCategoryDetails={getCategoryDetails}
                  />
                </div>

                <div className="mt-5 flex items-center gap-3">
                  <input
                    type="checkbox"
                    id="anonymous"
                    checked={isAnonymous}
                    onChange={(e) => setIsAnonymous(e.target.checked)}
                    className="w-4 h-4 rounded border-amber-400 text-amber-600 focus:ring-2 focus:ring-amber-500/30 bg-amber-50"
                  />
                  <label htmlFor="anonymous" className="text-sm text-amber-800 font-medium cursor-pointer select-none">
                    Post as Anonymous Seeker
                  </label>
                </div>

                <button
                  onClick={submitInsight}
                  disabled={isSubmitting || !newInsight.trim()}
                  className="mt-6 w-full px-4 py-3 bg-gradient-to-r from-amber-700 to-amber-600 hover:from-amber-800 hover:to-amber-700 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-lg font-bold shadow-lg hover:shadow-xl transition-all"
                  style={{ fontFamily: 'Georgia, serif' }}
                >
                  {isSubmitting ? 'Inscribing...' : 'Inscribe'}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}