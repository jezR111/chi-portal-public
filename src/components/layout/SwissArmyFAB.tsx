// src/components/layout/SwissArmyFAB.tsx
// Version: 1.3.0 - Fixed text selection interference

import { AnimatePresence, motion } from 'framer-motion';
import {
  Lightbulb,
  Plus,
  Share2,
  Sparkles,
  Trophy
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import React, { useEffect, useRef, useState } from 'react';

interface SwissArmyFABProps {
  onOpenInsightCapture: (text: string) => void;
  onQuickSave: (text: string) => void;
  onShareToWall?: (text: string) => void;
  onOpenQuestSidebar?: () => void;
  lessonContext?: {
    lessonId: string;
    lessonTitle: string;
    sectionId: string;
    timeInLesson: number;
  };
}

export const SwissArmyFAB: React.FC<SwissArmyFABProps> = ({
  onOpenInsightCapture,
  onQuickSave,
  onShareToWall,
  onOpenQuestSidebar,
  lessonContext
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [capturedText, setCapturedText] = useState('');
  const [showNotification, setShowNotification] = useState(false);
  const fabRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const [isMobile, setIsMobile] = useState(false);
  const isSelectingRef = useRef(false);
  const selectionCheckRef = useRef<NodeJS.Timeout>();

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Handle text selection without interfering
  useEffect(() => {
    const checkForSelection = () => {
      // Don't check if we're in the middle of selecting
      if (isSelectingRef.current) return;
      
      const selection = window.getSelection();
      const text = selection?.toString().trim();
      
      if (text && text.length > 10 && text.length < 500) {
        setCapturedText(text);
        setShowNotification(true);
        
        // Don't clear the selection - let the user keep it
        // Just hide notification after a delay
        setTimeout(() => setShowNotification(false), 3000);
      } else if (!text && capturedText) {
        // Clear captured text if selection is cleared
        setTimeout(() => {
          const currentSelection = window.getSelection();
          if (!currentSelection?.toString()) {
            setCapturedText('');
          }
        }, 100);
      }
    };

    const handleMouseDown = () => {
      isSelectingRef.current = true;
      clearTimeout(selectionCheckRef.current);
    };

    const handleMouseUp = () => {
      isSelectingRef.current = false;
      // Delay check to ensure selection is complete
      clearTimeout(selectionCheckRef.current);
      selectionCheckRef.current = setTimeout(checkForSelection, 100);
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      // Check for selection on Shift+Arrow keys
      if (e.shiftKey && ['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown'].includes(e.key)) {
        clearTimeout(selectionCheckRef.current);
        selectionCheckRef.current = setTimeout(checkForSelection, 100);
      }
    };

    // Use passive listeners to avoid blocking
    document.addEventListener('mousedown', handleMouseDown, { passive: true });
    document.addEventListener('mouseup', handleMouseUp, { passive: true });
    document.addEventListener('keyup', handleKeyUp, { passive: true });
    
    return () => {
      document.removeEventListener('mousedown', handleMouseDown);
      document.removeEventListener('mouseup', handleMouseUp);
      document.removeEventListener('keyup', handleKeyUp);
      clearTimeout(selectionCheckRef.current);
    };
  }, [capturedText]);

  // Close menu on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (fabRef.current && !fabRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      setTimeout(() => {
        document.addEventListener('mousedown', handleClickOutside);
      }, 100);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  const handleQuickSave = () => {
    if (capturedText) {
      onQuickSave(capturedText);
      
      // Clear selection only after save
      window.getSelection()?.removeAllRanges();
      setCapturedText('');
      setIsOpen(false);
      showSuccessNotification('Insight Saved!');
    }
  };

  const handleShareToWall = () => {
    if (capturedText && onShareToWall) {
      onShareToWall(capturedText);
      
      // Clear selection only after share
      window.getSelection()?.removeAllRanges();
      setCapturedText('');
      setIsOpen(false);
      showSuccessNotification('Shared to Wall!');
    }
  };

  const showSuccessNotification = (message: string) => {
    const notification = document.createElement('div');
    notification.className = 'fixed top-4 right-4 bg-gradient-to-r from-green-500 to-emerald-500 text-white px-6 py-3 rounded-xl shadow-xl z-[60] animate-slideIn flex items-center gap-2';
    notification.innerHTML = `
      <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
      </svg>
      ${message}
    `;
    document.body.appendChild(notification);
    setTimeout(() => {
      notification.style.opacity = '0';
      notification.style.transform = 'translateX(100px)';
      setTimeout(() => notification.remove(), 300);
    }, 2000);
  };

  // Only show buttons when not actively selecting
  const buttons = React.useMemo(() => [
    ...(isMobile && onOpenQuestSidebar ? [{
      id: 'quests',
      icon: <Trophy className="w-5 h-5" />,
      label: 'Quests',
      color: 'from-purple-500 to-pink-500',
      disabled: false,
      onClick: onOpenQuestSidebar
    }] : []),
    {
      id: 'new-insight',
      icon: <Plus className="w-5 h-5" />,
      label: 'New Insight',
      color: 'from-blue-500 to-indigo-500',
      disabled: false,
      onClick: () => onOpenInsightCapture('')
    },
    ...(capturedText ? [
      {
        id: 'save-selection',
        icon: <Lightbulb className="w-5 h-5" />,
        label: 'Save Selection',
        color: 'from-green-500 to-emerald-500',
        disabled: false,
        onClick: handleQuickSave
      },
      ...(onShareToWall ? [{
        id: 'share-wall',
        icon: <Share2 className="w-5 h-5" />,
        label: 'Share to Wall',
        color: 'from-purple-500 to-pink-500',
        disabled: false,
        onClick: handleShareToWall
      }] : [])
    ] : [])
  ], [capturedText, isMobile, onOpenQuestSidebar, onShareToWall]);

  // Hide FAB while selecting to prevent interference
  const shouldHide = isSelectingRef.current;

  return (
    <>
      {/* Text capture notification */}
      <AnimatePresence>
        {showNotification && capturedText && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            className="fixed top-20 right-4 z-[100] pointer-events-none"
          >
            <div className="bg-black/95 backdrop-blur-xl rounded-xl p-3 shadow-2xl max-w-xs border border-amber-500/20">
              <div className="flex items-center gap-2 text-amber-400 text-xs mb-1">
                <Sparkles className="w-3 h-3" />
                <span className="font-medium">Text Captured</span>
              </div>
              <p className="text-white/70 text-xs line-clamp-1">
                "{capturedText.substring(0, 40)}..."
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main FAB Container */}
      <div 
        ref={fabRef} 
        className="fixed bottom-8 right-8 z-50"
        style={{
          // Don't interfere with selection
          pointerEvents: shouldHide ? 'none' : 'auto',
          opacity: shouldHide ? 0.3 : 1,
          transition: 'opacity 0.2s'
        }}
      >
        {/* Action Buttons */}
        <AnimatePresence>
          {isOpen && !shouldHide && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute bottom-20 right-0 space-y-3"
            >
              {buttons.map((button, index) => (
                <motion.div
                  key={button.id}
                  initial={{ opacity: 0, scale: 0.8, y: 20 }}
                  animate={{ 
                    opacity: button.disabled ? 0.5 : 1, 
                    scale: 1,
                    y: 0
                  }}
                  exit={{ opacity: 0, scale: 0.8, y: 20 }}
                  transition={{ 
                    delay: index * 0.05,
                    type: "spring",
                    stiffness: 300,
                    damping: 25
                  }}
                  className="flex items-center justify-end gap-3 group"
                >
                  <motion.span 
                    initial={{ opacity: 0, x: 10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 + 0.1 }}
                    className="bg-black/95 backdrop-blur-xl text-white text-sm px-3 py-2 rounded-xl whitespace-nowrap shadow-xl border border-white/10"
                  >
                    {button.label}
                  </motion.span>
                  
                  <motion.button
                    onClick={button.onClick}
                    disabled={button.disabled}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                    className={`
                      relative w-12 h-12 rounded-full 
                      bg-gradient-to-br ${button.color}
                      text-white shadow-lg 
                      flex items-center justify-center
                      transition-all duration-200
                      ${button.disabled ? 'cursor-not-allowed opacity-50' : 'cursor-pointer hover:shadow-xl'}
                    `}
                  >
                    {button.icon}
                  </motion.button>
                </motion.div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Main FAB Button */}
        <motion.button
          onClick={() => setIsOpen(!isOpen)}
          className="relative w-14 h-14 rounded-full shadow-2xl flex items-center justify-center group"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <div className={`
            absolute inset-0 rounded-full transition-all duration-300
            ${isOpen 
              ? 'bg-gradient-to-br from-gray-700 to-gray-800' 
              : 'bg-gradient-to-br from-amber-500 to-orange-600'
            }
          `} />
          
          <motion.div
            animate={{ rotate: isOpen ? 135 : 0 }}
            transition={{ duration: 0.3, type: "spring" }}
            className="relative z-10"
          >
            <Sparkles className="w-6 h-6 text-white" />
          </motion.div>
          
          {capturedText && !isOpen && (
            <motion.span
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full flex items-center justify-center"
            >
              <span className="text-white text-[10px] font-bold">!</span>
            </motion.span>
          )}
          
          {!isOpen && !shouldHide && (
            <span className="absolute inset-0 rounded-full bg-amber-400 animate-ping opacity-20" />
          )}
        </motion.button>
      </div>

      <style jsx>{`
        @keyframes slideIn {
          from { transform: translateX(100px); opacity: 0; }
          to { transform: translateX(0); opacity: 1; }
        }
        .animate-slideIn {
          animation: slideIn 0.3s ease-out;
        }
      `}</style>
    </>
  );
};