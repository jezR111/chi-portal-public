// src/features/yin/xp/PathSetActiveSystem.tsx
// Version: 3.0.0 - Modal version with proper cost tracking

import { useEffect, useState } from 'react';
import { useXP } from './useXP';

interface PathSetActiveSystemProps {
  onPathActivated?: (pathId: string) => void;
  onClose?: () => void;
  pathToActivate?: { id: string; name: string; description?: string };
  show?: boolean;
}

export function PathSetActiveSystem({ 
  onPathActivated, 
  onClose,
  pathToActivate,
  show = false
}: PathSetActiveSystemProps) {
  const { currentXP, spendXP, canAfford } = useXP();
  const [activePath, setActivePath] = useState<string>('');
  const [hasEverSetPath, setHasEverSetPath] = useState(false); // CRITICAL: Track if user has ever set a path
  
  useEffect(() => {
    if (typeof window !== 'undefined') {
      setActivePath(localStorage.getItem('activePath') || '');
      // CRITICAL: Load the hasEverSetPath flag
      setHasEverSetPath(localStorage.getItem('hasEverSetPath') === 'true');
    }
  }, []);
  
  // CRITICAL: Cost logic matching v1.3.0
  const getCost = () => {
    if (!activePath || !hasEverSetPath) {
      return 25; // First time setting any path
    }
    return 75; // Changing from one path to another
  };
  
  const handleActivate = async () => {
    if (!pathToActivate) return;
    
    // Check if already active
    if (pathToActivate.id === activePath) {
      alert('This path is already active!');
      onClose?.();
      return;
    }
    
    const cost = getCost();
    
    if (!canAfford(cost)) {
      alert(`You need ${cost - currentXP} more XP`);
      onClose?.();
      return;
    }
    
    const success = await spendXP(cost, 'feature', `set-active-${pathToActivate.id}`);
    
    if (success) {
      setActivePath(pathToActivate.id);
      setHasEverSetPath(true); // CRITICAL: Mark that user has set a path
      
      // CRITICAL: Save both values to localStorage
      localStorage.setItem('activePath', pathToActivate.id);
      localStorage.setItem('hasEverSetPath', 'true');
      
      onPathActivated?.(pathToActivate.id);
      onClose?.();
    }
  };
  
  if (!show || !pathToActivate) return null;
  
  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50">
      <div className="bg-gray-900 p-6 rounded-xl max-w-md w-full mx-4 border border-gray-700">
        <h2 className="text-xl font-bold text-white mb-4">
          {!activePath || !hasEverSetPath ? 'Set Your First Path' : 'Change Your Focus?'}
        </h2>
        
        <p className="text-gray-300 mb-6">
          {!activePath || !hasEverSetPath
            ? `Setting "${pathToActivate.name}" as your active path will guide your initial journey.`
            : `Changing your focus to "${pathToActivate.name}" will shift your learning direction.`
          }
        </p>
        
        {pathToActivate.description && (
          <p className="text-gray-400 text-sm mb-4">{pathToActivate.description}</p>
        )}
        
        <div className="bg-purple-900/20 p-3 rounded-lg mb-6">
          <span className="text-yellow-400 font-bold">
            Cost: {getCost()} XP
          </span>
          <span className="text-gray-400 text-sm ml-2">
            (You have {currentXP} XP)
          </span>
        </div>
        
        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleActivate}
            disabled={!canAfford(getCost())}
            className={`flex-1 px-4 py-2 rounded-lg font-medium transition-colors ${
              canAfford(getCost())
                ? 'bg-purple-600 text-white hover:bg-purple-700'
                : 'bg-gray-700 text-gray-400 cursor-not-allowed'
            }`}
          >
            Confirm
          </button>
        </div>
      </div>
    </div>
  );
}