// src/features/yin/components/chapters/sections/SectionRenderer.tsx
import React from 'react';
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