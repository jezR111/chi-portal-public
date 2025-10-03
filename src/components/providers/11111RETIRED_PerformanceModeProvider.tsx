// src/components/providers/PerformanceModeProvider.tsx

'use client'

import { storageService } from '@/features/yin/services/storageService';
import { AnimatePresence, motion } from 'framer-motion';
import { Gauge, Settings } from 'lucide-react';
import React, { createContext, useContext, useEffect, useState } from 'react';

export enum PerformanceTier {
  ULTRA = 'ultra',    // Everything enabled, max quality
  HIGH = 'high',      // Most effects, some optimizations
  BALANCED = 'balanced', // Balanced performance/visuals
  LOW = 'low',        // Reduced effects
  BASIC = 'basic'     // Minimal effects for low-end devices
}

interface PerformanceConfig {
  tier: PerformanceTier;
  animations: boolean;
  particles: boolean;
  particleCount: number;
  blurEffects: boolean;
  shadows: boolean;
  gradients: boolean;
  transitions: boolean;
  soundEffects: boolean;
  complexAnimations: boolean;
  staggerAnimations: boolean;
  autoDetect: boolean;
}

const PERFORMANCE_PRESETS: Record<PerformanceTier, Partial<PerformanceConfig>> = {
  [PerformanceTier.ULTRA]: {
    animations: true,
    particles: true,
    particleCount: 50,
    blurEffects: true,
    shadows: true,
    gradients: true,
    transitions: true,
    soundEffects: true,
    complexAnimations: true,
    staggerAnimations: true
  },
  [PerformanceTier.HIGH]: {
    animations: true,
    particles: true,
    particleCount: 30,
    blurEffects: true,
    shadows: true,
    gradients: true,
    transitions: true,
    soundEffects: true,
    complexAnimations: true,
    staggerAnimations: false
  },
  [PerformanceTier.BALANCED]: {
    animations: true,
    particles: true,
    particleCount: 15,
    blurEffects: false,
    shadows: true,
    gradients: true,
    transitions: true,
    soundEffects: true,
    complexAnimations: false,
    staggerAnimations: false
  },
  [PerformanceTier.LOW]: {
    animations: true,
    particles: false,
    particleCount: 0,
    blurEffects: false,
    shadows: false,
    gradients: true,
    transitions: true,
    soundEffects: false,
    complexAnimations: false,
    staggerAnimations: false
  },
  [PerformanceTier.BASIC]: {
    animations: false,
    particles: false,
    particleCount: 0,
    blurEffects: false,
    shadows: false,
    gradients: false,
    transitions: false,
    soundEffects: false,
    complexAnimations: false,
    staggerAnimations: false
  }
};

interface PerformanceModeContextType extends PerformanceConfig {
  setTier: (tier: PerformanceTier) => void;
  toggleAutoDetect: () => void;
  shouldReduceMotion: boolean;
  canUseEffect: (effect: keyof PerformanceConfig) => boolean;
}

const PerformanceModeContext = createContext<PerformanceModeContextType | undefined>(undefined);

export const usePerformanceMode = () => {
  const context = useContext(PerformanceModeContext);
  if (!context) {
    throw new Error('usePerformanceMode must be used within PerformanceModeProvider');
  }
  return context;
};

interface PerformanceModeProviderProps {
  children: React.ReactNode;
}

export const PerformanceModeProvider: React.FC<PerformanceModeProviderProps> = ({ children }) => {
  const [config, setConfig] = useState<PerformanceConfig>({
    tier: PerformanceTier.BALANCED,
    autoDetect: true,
    ...PERFORMANCE_PRESETS[PerformanceTier.BALANCED]
  });
  const [showSettings, setShowSettings] = useState(false);
  const [systemPrefersReducedMotion, setSystemPrefersReducedMotion] = useState(false);
  const [detectedTier, setDetectedTier] = useState<PerformanceTier>(PerformanceTier.BALANCED);

  // Auto-detect performance capabilities
  useEffect(() => {
    const detectPerformance = () => {
      // Check various performance indicators
      const deviceMemory = (navigator as any).deviceMemory || 4;
      const hardwareConcurrency = navigator.hardwareConcurrency || 4;
      const connection = (navigator as any).connection;
      const connectionSpeed = connection?.effectiveType || '4g';
      
      // Simple scoring system
      let score = 0;
      
      // Memory score (0-3)
      if (deviceMemory >= 8) score += 3;
      else if (deviceMemory >= 4) score += 2;
      else if (deviceMemory >= 2) score += 1;
      
      // CPU cores score (0-3)
      if (hardwareConcurrency >= 8) score += 3;
      else if (hardwareConcurrency >= 4) score += 2;
      else if (hardwareConcurrency >= 2) score += 1;
      
      // Connection score (0-2)
      if (connectionSpeed === '4g') score += 2;
      else if (connectionSpeed === '3g') score += 1;
      
      // Determine tier based on score (0-8)
      if (score >= 7) setDetectedTier(PerformanceTier.ULTRA);
      else if (score >= 5) setDetectedTier(PerformanceTier.HIGH);
      else if (score >= 3) setDetectedTier(PerformanceTier.BALANCED);
      else if (score >= 1) setDetectedTier(PerformanceTier.LOW);
      else setDetectedTier(PerformanceTier.BASIC);
    };

    detectPerformance();
    
    // Check system preference
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setSystemPrefersReducedMotion(mediaQuery.matches);
    
    const handleChange = (e: MediaQueryListEvent) => {
      setSystemPrefersReducedMotion(e.matches);
      if (e.matches && config.autoDetect) {
        setTier(PerformanceTier.LOW);
      }
    };
    
    mediaQuery.addEventListener('change', handleChange);
    
    // Load saved settings
    const savedSettings = storageService.getSettings();
    if (savedSettings.performanceTier) {
      setConfig(prev => ({
        ...prev,
        tier: savedSettings.performanceTier as PerformanceTier,
        autoDetect: savedSettings.autoDetect ?? true,
        ...PERFORMANCE_PRESETS[savedSettings.performanceTier as PerformanceTier]
      }));
    } else if (config.autoDetect) {
      // Use detected tier if no saved settings
      setConfig(prev => ({
        ...prev,
        tier: detectedTier,
        ...PERFORMANCE_PRESETS[detectedTier]
      }));
    }
    
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  const setTier = (tier: PerformanceTier) => {
    const newConfig = {
      ...config,
      tier,
      ...PERFORMANCE_PRESETS[tier]
    };
    setConfig(newConfig);
    storageService.updateSettings({ 
      performanceTier: tier,
      autoDetect: config.autoDetect 
    });
  };

  const toggleAutoDetect = () => {
    const newAutoDetect = !config.autoDetect;
    setConfig(prev => ({ ...prev, autoDetect: newAutoDetect }));
    
    if (newAutoDetect) {
      // Apply detected tier
      setTier(detectedTier);
    }
    
    storageService.updateSettings({ autoDetect: newAutoDetect });
  };

  const canUseEffect = (effect: keyof PerformanceConfig): boolean => {
    if (systemPrefersReducedMotion && 
        (effect === 'animations' || effect === 'complexAnimations' || effect === 'particles')) {
      return false;
    }
    return config[effect] as boolean;
  };

  const shouldReduceMotion = systemPrefersReducedMotion || !config.animations;

  const value: PerformanceModeContextType = {
    ...config,
    setTier,
    toggleAutoDetect,
    shouldReduceMotion,
    canUseEffect
  };

  return (
    <PerformanceModeContext.Provider value={value}>
      {children}
      
      {/* Performance Settings Button */}
      <motion.button
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        whileHover={!shouldReduceMotion ? { scale: 1.1 } : {}}
        onClick={() => setShowSettings(!showSettings)}
        className="fixed bottom-20 right-4 z-50 w-12 h-12 bg-purple-600/90 hover:bg-purple-700/90 rounded-full shadow-lg flex items-center justify-center backdrop-blur-sm border border-purple-400/30"
        aria-label="Performance Settings"
      >
        <Gauge className="w-5 h-5 text-white" />
      </motion.button>

      {/* Settings Panel */}
      <AnimatePresence>
        {showSettings && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowSettings(false)}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
            />
            
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="fixed bottom-36 right-4 z-50 bg-gray-900/95 backdrop-blur-xl rounded-2xl p-6 w-96 shadow-2xl border border-purple-500/20"
            >
              <div className="flex items-center gap-2 mb-4">
                <Settings className="w-5 h-5 text-purple-400" />
                <h3 className="text-lg font-semibold text-white">Performance Settings</h3>
              </div>

              {/* Auto-detect Toggle */}
              <div className="flex items-center justify-between mb-4 pb-4 border-b border-purple-500/20">
                <div>
                  <p className="text-white font-medium">Auto-detect</p>
                  <p className="text-xs text-gray-400">
                    Automatically adjust for your device
                  </p>
                  {config.autoDetect && (
                    <p className="text-xs text-purple-400 mt-1">
                      Detected: {detectedTier.toUpperCase()}
                    </p>
                  )}
                </div>
                <button
                  onClick={toggleAutoDetect}
                  className={`relative w-14 h-7 rounded-full transition-colors ${
                    config.autoDetect ? 'bg-purple-600' : 'bg-gray-600'
                  }`}
                >
                  <motion.div
                    animate={{ x: config.autoDetect ? 28 : 2 }}
                    transition={{ duration: 0.2 }}
                    className="absolute top-1 w-5 h-5 bg-white rounded-full"
                  />
                </button>
              </div>

              {/* Performance Tier Selection */}
              <div className="space-y-2">
                <p className="text-sm text-gray-400 mb-2">Performance Tier</p>
                {Object.values(PerformanceTier).map((tier) => (
                  <button
                    key={tier}
                    onClick={() => setTier(tier)}
                    disabled={config.autoDetect}
                    className={`w-full p-3 rounded-lg border transition-all text-left ${
                      config.tier === tier 
                        ? 'bg-purple-600/20 border-purple-500 text-white' 
                        : 'bg-gray-800/50 border-gray-700 text-gray-300 hover:bg-gray-700/50'
                    } ${config.autoDetect ? 'opacity-50 cursor-not-allowed' : ''}`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-medium capitalize">{tier}</span>
                      <span className="text-xs opacity-70">
                        {tier === PerformanceTier.ULTRA && '🚀 Max Quality'}
                        {tier === PerformanceTier.HIGH && '✨ High Quality'}
                        {tier === PerformanceTier.BALANCED && '⚖️ Balanced'}
                        {tier === PerformanceTier.LOW && '🔋 Power Saver'}
                        {tier === PerformanceTier.BASIC && '📱 Basic'}
                      </span>
                    </div>
                  </button>
                ))}
              </div>

              {/* Current Settings Display */}
              <div className="mt-4 pt-4 border-t border-purple-500/20">
                <p className="text-xs text-gray-400 mb-2">Current Settings:</p>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <span className={config.animations ? 'text-green-400' : 'text-gray-500'}>
                    {config.animations ? '✓' : '✗'} Animations
                  </span>
                  <span className={config.particles ? 'text-green-400' : 'text-gray-500'}>
                    {config.particles ? '✓' : '✗'} Particles ({config.particleCount})
                  </span>
                  <span className={config.blurEffects ? 'text-green-400' : 'text-gray-500'}>
                    {config.blurEffects ? '✓' : '✗'} Blur Effects
                  </span>
                  <span className={config.shadows ? 'text-green-400' : 'text-gray-500'}>
                    {config.shadows ? '✓' : '✗'} Shadows
                  </span>
                </div>
              </div>

              {systemPrefersReducedMotion && (
                <p className="text-xs text-yellow-400 mt-2">
                  ⚠️ System prefers reduced motion
                </p>
              )}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </PerformanceModeContext.Provider>
  );
};

// Utility hook for conditional styles
export const usePerformanceStyles = () => {
  const { canUseEffect } = usePerformanceMode();
  
  return {
    blur: canUseEffect('blurEffects') ? 'backdrop-blur-sm' : '',
    shadow: canUseEffect('shadows') ? 'shadow-lg' : '',
    gradient: canUseEffect('gradients') ? true : false,
    transition: canUseEffect('transitions') ? 'transition-all' : ''
  };
};