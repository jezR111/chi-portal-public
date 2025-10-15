// src/features/yin/components/chapters/sections/SectionRenderer.tsx
import React, { useEffect } from 'react';
import { ImageSection } from './ImageSection';
import { QuoteSection } from './QuoteSection';
import { TextSection } from './TextSection';
import { VideoSection } from './VideoSection';

interface SectionRendererProps {
  section: any;
  sectionNumber: number;
  totalSections: number;
}

export const SectionRenderer: React.FC<SectionRendererProps> = ({
  section,
  sectionNumber,
  totalSections
}) => {
  // Add selection class to body to pause animations
  useEffect(() => {
    let isSelecting = false;
    
    const handleSelectionStart = () => {
      isSelecting = true;
      document.body.classList.add('selecting');
    };
    
    const handleSelectionEnd = () => {
      const selection = window.getSelection();
      if (!selection || !selection.toString()) {
        isSelecting = false;
        document.body.classList.remove('selecting');
      }
    };
    
    const handleSelectionChange = () => {
      const selection = window.getSelection();
      if (selection && selection.toString()) {
        if (!isSelecting) {
          handleSelectionStart();
        }
      } else {
        if (isSelecting) {
          handleSelectionEnd();
        }
      }
    };

    document.addEventListener('selectionchange', handleSelectionChange);
    document.addEventListener('selectstart', handleSelectionStart);
    document.addEventListener('mouseup', handleSelectionEnd);
    document.addEventListener('touchend', handleSelectionEnd);
    
    return () => {
      document.removeEventListener('selectionchange', handleSelectionChange);
      document.removeEventListener('selectstart', handleSelectionStart);
      document.removeEventListener('mouseup', handleSelectionEnd);
      document.removeEventListener('touchend', handleSelectionEnd);
      document.body.classList.remove('selecting');
    };
  }, []);
  
  if (!section) {
    return (
      <div className="text-center py-12">
        <p className="text-purple-300">Section not found</p>
      </div>
    );
  }

  switch (section.type) {
    case 'text':
    case 'introduction':
    case 'teaching':
    case 'practice':
    case 'reflection':
      return (
        <TextSection
          content={section.content}
          title={section.title}
          sectionNumber={sectionNumber}
          totalSections={totalSections}
        />
      );
    
    case 'image':
      return (
        <ImageSection
          url={section.url}
          caption={section.caption}
          alt={section.alt}
        />
      );
    
    case 'video':
      return (
        <VideoSection
          url={section.url}
          title={section.title}
          duration={section.duration}
        />
      );
    
    case 'quote':
      return (
        <QuoteSection
          content={section.content}
          author={section.author}
        />
      );
    
    default:
      return (
        <div className="text-center py-12 bg-black/30 rounded-xl">
          <p className="text-purple-300">Unknown section type: {section.type}</p>
        </div>
      );
  }
};