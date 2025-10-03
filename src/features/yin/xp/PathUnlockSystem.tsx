// src/features/yin/components/paths/PathUnlockSystem.tsx
// Version: 1.1.0 - Fixed XP spending/refunding for path system
// Changes: Added proper state sync, fixed XP calculations

import { useXP } from '@/features/yin/xp/useXP';
import { getPathUnlockCost } from '@/features/yin/xp/xpConfig';
import { xpService } from '@/features/yin/xp/xpService';
import { useEffect, useState } from 'react';

interface Path {
  id: string;
  name: string;
  orderIndex: number;
  isLocked: boolean;
  isActive?: boolean; // New: track if path is currently active
}

export function PathUnlockSystem() {
  const { 
    currentXP, 
    spendXP, 
    canAfford, 
    isUnlocked 
  } = useXP();
  
  const [paths, setPaths] = useState<Path[]>([
    { id: 'the-self', name: 'The Self', orderIndex: 1, isLocked: false, isActive: true },
    { id: 'energy-bodies', name: 'Energy Bodies', orderIndex: 2, isLocked: true, isActive: false },
    { id: 'self-mastery', name: 'Self Mastery', orderIndex: 3, isLocked: true, isActive: false },
    { id: 'shadow-work', name: 'Shadow Work', orderIndex: 4, isLocked: true, isActive: false }
  ]);
  
  // Sync with actual unlock status on mount and XP changes
  useEffect(() => {
    setPaths(prev => prev.map(path => ({
      ...path,
      isLocked: path.orderIndex === 1 ? false : !isUnlocked('paths', path.id)
    })));
  }, [currentXP, isUnlocked]);
  
  // Handle path unlock (SPEND XP to permanently unlock)
  const handleUnlockPath = async (path: Path) => {
    const cost = getPathUnlockCost(path.orderIndex);
    
    if (!canAfford(cost)) {
      alert(`You need ${cost - currentXP} more XP to unlock ${path.name}`);
      return;
    }
    
    if (isUnlocked('paths', path.id)) {
      alert('This path is already unlocked!');
      return;
    }
    
    // Spend XP to unlock
    const success = await spendXP(cost, 'path', path.id);
    
    if (success) {
      setPaths(prev => prev.map(p => 
        p.id === path.id ? { ...p, isLocked: false } : p
      ));
      
      alert(`Successfully unlocked ${path.name} for ${cost} XP!`);
    } else {
      alert('Failed to unlock path. Please try again.');
    }
  };
  
  // Handle path release (REFUND XP and re-lock the path)
  const handleReleasePath = async (path: Path) => {
    if (path.orderIndex === 1) {
      alert('Cannot release the first path - it\'s your foundation!');
      return;
    }
    
    if (!isUnlocked('paths', path.id)) {
      alert('This path is not unlocked!');
      return;
    }
    
    const originalCost = getPathUnlockCost(path.orderIndex);
    const refundAmount = Math.floor(originalCost * 0.5);
    
    if (!confirm(`Release ${path.name}? You'll get ${refundAmount} XP back (50% refund).`)) {
      return;
    }
    
    // Use the releaseUnlock method which adds the refund
    const success = xpService.releaseUnlock('path', path.id, refundAmount);
    
    if (success) {
      setPaths(prev => prev.map(p => 
        p.id === path.id ? { ...p, isLocked: true, isActive: false } : p
      ));
      
      alert(`Released ${path.name}. Refunded ${refundAmount} XP.`);
    } else {
      alert('Failed to release path.');
    }
  };
  
  // Handle setting path as active (COSTS XP per activation)
  const handleSetActive = async (path: Path) => {
    if (path.isLocked) {
      alert('Unlock this path first!');
      return;
    }
    
    if (path.isActive) {
      alert('This path is already active!');
      return;
    }
    
    const activationCost = 50; // Fixed cost to activate any unlocked path
    
    if (!canAfford(activationCost)) {
      alert(`You need ${activationCost} XP to activate this path`);
      return;
    }
    
    // Spend XP for activation
    const { addXP } = useXP();
    
    // Actually subtract XP for activation
    const success = await spendXP(activationCost, 'feature', `activate-${path.id}`);
    
    if (success) {
      setPaths(prev => prev.map(p => ({
        ...p,
        isActive: p.id === path.id // Only one path active at a time
      })));
      
      alert(`Activated ${path.name} for ${activationCost} XP`);
    }
  };
  
  return (
    <div className="space-y-4">
      {/* XP Display */}
      <div className="bg-purple-900/20 p-4 rounded-lg">
        <h3 className="text-white font-bold mb-2">Your XP: {currentXP}</h3>
        <p className="text-gray-400 text-sm">Unlock paths permanently or activate them temporarily</p>
      </div>
      
      {/* Path List */}
      {paths.map(path => {
        const unlockCost = getPathUnlockCost(path.orderIndex);
        const canUnlock = canAfford(unlockCost) && path.isLocked;
        const activationCost = 50;
        
        return (
          <div 
            key={path.id}
            className={`bg-gray-800 p-4 rounded-lg border-2 ${
              path.isActive ? 'border-purple-500' : 'border-transparent'
            }`}
          >
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-white font-semibold">
                  {path.name}
                  {path.isActive && <span className="ml-2 text-purple-400">(Active)</span>}
                </h4>
                
                {path.isLocked ? (
                  <p className="text-gray-400 text-sm">Unlock Cost: {unlockCost} XP</p>
                ) : (
                  <div className="space-y-1">
                    <p className="text-green-400 text-sm">✓ Unlocked</p>
                    {!path.isActive && (
                      <p className="text-blue-400 text-sm">Activation Cost: {activationCost} XP</p>
                    )}
                  </div>
                )}
              </div>
              
              <div className="flex gap-2">
                {path.isLocked ? (
                  <button
                    onClick={() => handleUnlockPath(path)}
                    disabled={!canUnlock}
                    className={`px-4 py-2 rounded-lg font-medium ${
                      canUnlock
                        ? 'bg-purple-600 text-white hover:bg-purple-700'
                        : 'bg-gray-700 text-gray-400 cursor-not-allowed'
                    }`}
                  >
                    {canUnlock ? 'Unlock' : `Need ${unlockCost - currentXP} XP`}
                  </button>
                ) : (
                  <>
                    {!path.isActive && (
                      <button
                        onClick={() => handleSetActive(path)}
                        disabled={!canAfford(activationCost)}
                        className={`px-4 py-2 rounded-lg font-medium ${
                          canAfford(activationCost)
                            ? 'bg-blue-600 text-white hover:bg-blue-700'
                            : 'bg-gray-700 text-gray-400 cursor-not-allowed'
                        }`}
                      >
                        Set Active ({activationCost} XP)
                      </button>
                    )}
                    
                    {path.orderIndex > 1 && (
                      <button
                        onClick={() => handleReleasePath(path)}
                        className="px-4 py-2 bg-red-600/20 text-red-400 rounded-lg hover:bg-red-600/30"
                      >
                        Release (50% refund)
                      </button>
                    )}
                  </>
                )}
              </div>
            </div>
          </div>
        );
      })}
      
      {/* Info Box */}
      <div className="bg-gray-800/50 p-4 rounded-lg">
        <h4 className="text-gray-300 font-semibold mb-2">How it works:</h4>
        <ul className="text-gray-400 text-sm space-y-1">
          <li>• <strong>Unlock:</strong> Permanently unlock a path (one-time cost)</li>
          <li>• <strong>Set Active:</strong> Activate an unlocked path (costs XP each time)</li>
          <li>• <strong>Release:</strong> Lock the path again and get 50% XP refund</li>
        </ul>
      </div>
    </div>
  );
}