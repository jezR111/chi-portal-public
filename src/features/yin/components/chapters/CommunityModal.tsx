// src/features/yin/components/chapters/CommunityModal.tsx

import { AnimatePresence, motion } from 'framer-motion';
import { MessageCircle, Users, X } from 'lucide-react';
import { useState } from 'react';

interface CommunityModalProps {
  isOpen: boolean;
  onClose: () => void;
  context: {
    type: string;
    id: string;
    title: string;
  } | null;
}

export default function CommunityModal({ isOpen, onClose, context }: CommunityModalProps) {
  const [activeTab, setActiveTab] = useState<'discussion' | 'members'>('discussion');
  
  // This will eventually connect to real community data based on context
  // For now, it's a general community interface
  
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            onClick={(e) => e.stopPropagation()}
            className="bg-purple-950/95 backdrop-blur-xl rounded-3xl max-w-4xl w-full max-h-[80vh] overflow-hidden border border-purple-500/30"
          >
            {/* Header */}
            <div className="p-6 border-b border-purple-500/20">
              <div className="flex items-start justify-between">
                <div>
                  <h2 className="text-2xl font-bold text-white mb-2">Community Hub</h2>
                  <p className="text-purple-300">
                    {context?.type === 'chapter' 
                      ? `People studying: ${context.title}`
                      : 'Connect with fellow learners'
                    }
                  </p>
                </div>
                <button
                  onClick={onClose}
                  className="p-2 hover:bg-purple-800/50 rounded-xl transition-colors"
                >
                  <X className="w-6 h-6 text-purple-300" />
                </button>
              </div>
              
              {/* Tabs */}
              <div className="flex gap-4 mt-4">
                <button
                  onClick={() => setActiveTab('discussion')}
                  className={`px-4 py-2 rounded-lg transition-colors ${
                    activeTab === 'discussion'
                      ? 'bg-purple-800/50 text-white'
                      : 'text-purple-400 hover:text-white'
                  }`}
                >
                  <MessageCircle className="w-4 h-4 inline mr-2" />
                  Discussion
                </button>
                <button
                  onClick={() => setActiveTab('members')}
                  className={`px-4 py-2 rounded-lg transition-colors ${
                    activeTab === 'members'
                      ? 'bg-purple-800/50 text-white'
                      : 'text-purple-400 hover:text-white'
                  }`}
                >
                  <Users className="w-4 h-4 inline mr-2" />
                  Members ({Math.floor(Math.random() * 20) + 5})
                </button>
              </div>
            </div>
            
            {/* Content */}
            <div className="p-6 h-[400px] overflow-y-auto">
              {activeTab === 'discussion' ? (
                <div className="space-y-4">
                  <div className="bg-purple-900/30 rounded-xl p-4 border border-purple-500/20">
                    <p className="text-purple-200 mb-2">
                      <span className="font-semibold text-white">Sarah M:</span> Just finished the overview lesson! The concept of the observer really clicked for me.
                    </p>
                    <span className="text-purple-400 text-sm">2 hours ago</span>
                  </div>
                  
                  <div className="bg-purple-900/30 rounded-xl p-4 border border-purple-500/20">
                    <p className="text-purple-200 mb-2">
                      <span className="font-semibold text-white">Alex K:</span> Anyone want to discuss the paradox mentioned in lesson 2? I'm finding it challenging.
                    </p>
                    <span className="text-purple-400 text-sm">5 hours ago</span>
                  </div>
                  
                  <div className="text-center py-8 text-purple-400">
                    Community features are being developed. Soon you'll be able to discuss lessons, share insights, and connect with others on the same journey.
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {[...Array(6)].map((_, i) => (
                    <div key={i} className="bg-purple-900/30 rounded-xl p-4 border border-purple-500/20">
                      <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full mb-2" />
                      <p className="text-white font-semibold">Learner {i + 1}</p>
                      <p className="text-purple-400 text-sm">Level {Math.floor(Math.random() * 10) + 1}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}