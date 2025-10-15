// src/features/yin/hooks/useTextSelection.ts
import { useEffect } from 'react';

export const useTextSelection = () => {
  useEffect(() => {
    let scrollPosition = { x: 0, y: 0 };
    let isSelecting = false;
    
    const preventScroll = (e: Event) => {
      if (isSelecting) {
        e.preventDefault();
        window.scrollTo(scrollPosition.x, scrollPosition.y);
      }
    };
    
    const handleSelectionStart = () => {
      isSelecting = true;
      scrollPosition = { x: window.scrollX, y: window.scrollY };
      
      // Disable all scroll behaviors
      document.body.style.overflow = 'hidden';
      document.body.style.position = 'fixed';
      document.body.style.width = '100%';
      document.body.style.top = `-${scrollPosition.y}px`;
    };
    
    const handleSelectionEnd = () => {
      const selection = window.getSelection();
      if (!selection || !selection.toString()) {
        isSelecting = false;
        
        // Re-enable scroll
        document.body.style.overflow = '';
        document.body.style.position = '';
        document.body.style.width = '';
        document.body.style.top = '';
        window.scrollTo(scrollPosition.x, scrollPosition.y);
      }
    };

    // Listen to all selection events
    document.addEventListener('selectstart', handleSelectionStart);
    document.addEventListener('mouseup', handleSelectionEnd);
    document.addEventListener('touchend', handleSelectionEnd);
    document.addEventListener('scroll', preventScroll, { passive: false });
    window.addEventListener('scroll', preventScroll, { passive: false });
    
    return () => {
      document.removeEventListener('selectstart', handleSelectionStart);
      document.removeEventListener('mouseup', handleSelectionEnd);
      document.removeEventListener('touchend', handleSelectionEnd);
      document.removeEventListener('scroll', preventScroll);
      window.removeEventListener('scroll', preventScroll);
      
      // Clean up any stuck styles
      document.body.style.overflow = '';
      document.body.style.position = '';
      document.body.style.width = '';
      document.body.style.top = '';
    };
  }, []);
};