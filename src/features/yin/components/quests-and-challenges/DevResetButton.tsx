// src/features/yin/components/quests-and-challenges/DevResetButton.tsx

import { RotateCcw, Trash2 } from 'lucide-react';
import { useState } from 'react';
import { challengeService } from '../../services/challengeService';

export const DevResetButton: React.FC<{ onReset: () => void }> = ({ onReset }) => {
  const [showConfirm, setShowConfirm] = useState(false);
  
  // Show button based on a query parameter or always in dev
  // You can add ?dev=true to your URL to show it
  const isDev = typeof window !== 'undefined' && 
    (process.env.NODE_ENV === 'development' || 
     window.location.search.includes('dev=true'));
  
  if (!isDev) return null;

  const handleResetQuests = () => {
    localStorage.removeItem('quest_progress');
    onReset();
    setShowConfirm(false);
    console.log('Quests reset!');
  };

  const handleResetAll = () => {
    localStorage.removeItem('quest_progress');
    challengeService.resetAll();
    onReset();
    setShowConfirm(false);
    console.log('Everything reset!');
  };

  return (
    <div className="fixed bottom-4 left-4 z-[9999]">
      {!showConfirm ? (
        <button
          onClick={() => setShowConfirm(true)}
          className="p-3 bg-red-600 hover:bg-red-700 rounded-full text-white shadow-lg transition-all flex items-center gap-2"
          title="Dev Reset"
        >
          <RotateCcw className="w-5 h-5" />
          <span className="text-xs">DEV</span>
        </button>
      ) : (
        <div className="bg-gray-900 rounded-lg p-4 border border-red-500 space-y-2 shadow-2xl">
          <p className="text-white text-sm mb-3 font-bold">Dev Reset Options:</p>
          <button
            onClick={handleResetQuests}
            className="w-full px-3 py-2 bg-orange-600 hover:bg-orange-700 rounded text-white text-sm flex items-center gap-2 transition-all"
          >
            <RotateCcw className="w-4 h-4" />
            Reset Quests Only
          </button>
          <button
            onClick={handleResetAll}
            className="w-full px-3 py-2 bg-red-600 hover:bg-red-700 rounded text-white text-sm flex items-center gap-2 transition-all"
          >
            <Trash2 className="w-4 h-4" />
            Reset Everything
          </button>
          <button
            onClick={() => setShowConfirm(false)}
            className="w-full px-3 py-2 bg-gray-700 hover:bg-gray-600 rounded text-white text-sm transition-all"
          >
            Cancel
          </button>
        </div>
      )}
    </div>
  );
};