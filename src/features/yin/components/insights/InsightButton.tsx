// src/features/yin/components/insights/InsightButton.tsx

import { AnimatePresence, motion } from 'framer-motion';
import { Brain, Lightbulb, Sparkles } from 'lucide-react';
import React, { useEffect, useState } from 'react';

interface InsightButtonProps {
  lessonId: string;
  sectionId?: string;
  timeInLesson: number;
  onInsightClick: () => void;
  position?: 'fixed' | 'absolute' | 'relative';
  className?: string;
}

export const InsightButton: React.FC<InsightButtonProps> = ({
  lessonId,
  sectionId,
  timeInLesson,
  onInsightClick,
  position = 'fixed',
  className = ''
}) => {
  const [isGlowing, setIsGlowing] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);
  const [pulseCount, setPulseCount] = useState(0);
  
  // Periodic glow effect to draw attention
  useEffect(() => {
    const interval = setInterval(() => {
      setPulseCount(prev => prev + 1);
      setIsGlowing(true);
      setTimeout(() => setIsGlowing(false), 2000);
    }, 30000); // Every 30 seconds
    
    return () => clearInterval(interval);
  }, []);
  
  // Show tooltip on first appearance
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowTooltip(true);
      setTimeout(() => setShowTooltip(false), 5000);
    }, 3000);
    
    return () => clearTimeout(timer);
  }, []);
  
  const handleClick = () => {
    // Trigger celebration animation
    triggerCelebration();
    onInsightClick();
  };
  
  const triggerCelebration = () => {
    // Create particles effect
    const button = document.getElementById('insight-button');
    if (button) {
      const rect = button.getBoundingClientRect();
      createParticles(rect.left + rect.width / 2, rect.top + rect.height / 2);
    }
  };
  
  const createParticles = (x: number, y: number) => {
    const colors = ['#fbbf24', '#a78bfa', '#ec4899', '#60a5fa'];
    const particles = 12;
    
    for (let i = 0; i < particles; i++) {
      const particle = document.createElement('div');
      particle.className = 'insight-particle';
      particle.style.cssText = `
        position: fixed;
        width: 8px;
        height: 8px;
        background: ${colors[Math.floor(Math.random() * colors.length)]};
        border-radius: 50%;
        pointer-events: none;
        z-index: 9999;
        left: ${x}px;
        top: ${y}px;
      `;
      
      document.body.appendChild(particle);
      
      const angle = (Math.PI * 2 * i) / particles;
      const velocity = 3 + Math.random() * 3;
      const lifetime = 1000 + Math.random() * 500;
      
      let posX = 0;
      let posY = 0;
      let opacity = 1;
      const startTime = Date.now();
      
      const animate = () => {
        const elapsed = Date.now() - startTime;
        const progress = elapsed / lifetime;
        
        if (progress >= 1) {
          particle.remove();
          return;
        }
        
        posX += Math.cos(angle) * velocity;
        posY += Math.sin(angle) * velocity + progress * 2;
        opacity = 1 - progress;
        
        particle.style.transform = `translate(${posX}px, ${posY}px) scale(${1 - progress * 0.5})`;
        particle.style.opacity = opacity.toString();
        
        requestAnimationFrame(animate);
      };
      
      requestAnimationFrame(animate);
    }
  };
  
  const getPositionClasses = () => {
    if (position === 'fixed') {
      return 'fixed bottom-24 right-8 z-40';
    } else if (position === 'absolute') {
      return 'absolute bottom-8 right-8';
    }
    return '';
  };
  
 return (
  <>
    <AnimatePresence>
      {showTooltip && (
        <motion.div
          className={`${position === 'fixed' ? 'fixed bottom-40 right-8' : 'absolute bottom-24 right-8'} z-50 bg-purple-900/90 backdrop-blur-sm px-4 py-2 rounded-xl border border-purple-500/30`}
          initial={{ opacity: 0, y: 10, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 10, scale: 0.9 }}
        >
          <p className="text-white text-sm font-medium">Click when something resonates! 💡</p>
          <div className="absolute bottom-0 right-8 transform translate-y-1/2 rotate-45 w-2 h-2 bg-purple-900/90 border-r border-b border-purple-500/30" />
        </motion.div>
      )}
    </AnimatePresence>
    
    <motion.button
      id="insight-button"
      onClick={handleClick}
      className={`${getPositionClasses()} group ${className}`}
      initial={{ scale: 0, rotate: -180 }}
      animate={{ scale: 1, rotate: 0 }}
      transition={{ type: "spring", stiffness: 200, damping: 15 }}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.95 }}
    >
      {/* Main Button */}
      <motion.div
        className="relative w-14 h-14 bg-gradient-to-br from-yellow-500 to-amber-600 rounded-2xl shadow-lg shadow-yellow-500/30 flex items-center justify-center overflow-hidden"
        animate={isGlowing ? {
          boxShadow: [
            '0 0 20px rgba(251, 191, 36, 0.3)',
            '0 0 40px rgba(251, 191, 36, 0.5)',
            '0 0 20px rgba(251, 191, 36, 0.3)'
          ]
        } : {}}
        transition={{ duration: 2, repeat: isGlowing ? Infinity : 0 }}
      >
        {/* Inner Glow */}
        <motion.div
          className="absolute inset-0 bg-gradient-to-br from-yellow-400/50 to-transparent"
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 2, repeat: Infinity }}
        />
        
        {/* Icon */}
        <Lightbulb className="w-7 h-7 text-white relative z-10" fill="currentColor" />
        
        {/* Pulse Ring */}
        <motion.div
          className="absolute inset-0 rounded-2xl border-2 border-yellow-400"
          animate={{ scale: [1, 1.3], opacity: [0.5, 0] }}
          transition={{ duration: 1.5, repeat: Infinity }}
        />
      </motion.div>
      
      {/* Floating Icons */}
      <AnimatePresence>
        {pulseCount > 0 && pulseCount % 3 === 0 && (
          <motion.div
            className="absolute -top-2 -right-2"
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            exit={{ scale: 0, rotate: 180 }}
          >
            <Sparkles className="w-4 h-4 text-yellow-400" />
          </motion.div>
        )}
      </AnimatePresence>
    </motion.button>
    
    {/* Quick Action Button (separate, not nested) */}
    <motion.div
      className={`${position === 'fixed' ? 'fixed bottom-24 right-24' : 'absolute bottom-8 right-24'} z-40 opacity-0 hover:opacity-100 transition-opacity`}
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
    >
      <button
        className="w-10 h-10 bg-purple-600/80 backdrop-blur-sm rounded-xl flex items-center justify-center hover:bg-purple-600"
        onClick={onInsightClick}
        aria-label="Quick capture"
      >
        <Brain className="w-5 h-5 text-white" />
      </button>
    </motion.div>
  </>
);
};

export default InsightButton;