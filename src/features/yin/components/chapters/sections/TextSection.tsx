// src/features/yin/components/chapters/sections/TextSection.tsx
import React from 'react';

interface TextSectionProps {
  content: string;
  title?: string;
  sectionNumber: number;
  totalSections: number;
}

export const TextSection: React.FC<TextSectionProps> = ({
  content,
  title,
  sectionNumber,
  totalSections
}) => {
  // Simple HTML rendering without any animations or effects
  const renderContent = () => {
    if (!content) return '';
    
    let formatted = content
      .replace(/!\[(.*?)\]\((.*?)\)/g, '<img src="$2" alt="$1" class="my-6 rounded-2xl shadow-lg w-full h-auto object-cover" />')
      .replace(/^### (.*?)$/gm, '<h3 class="text-xl font-bold text-purple-200 mb-3 mt-6">$1</h3>')
      .replace(/^## (.*?)$/gm, '<h2 class="text-2xl font-bold text-white mb-4 mt-8">$1</h2>')
      .replace(/^# (.*?)$/gm, '<h1 class="text-3xl font-bold text-purple-200 mb-6">$1</h1>')
      .replace(/\*\*(.*?)\*\*/g, '<strong class="font-bold text-purple-100">$1</strong>')
      .replace(/\*(.*?)\*/g, '<em class="italic text-purple-200">$1</em>')
      .replace(/^- (.*?)$/gm, '<li class="ml-6 text-purple-100/90 list-disc">$1</li>')
      .replace(/^\d+\. (.*?)$/gm, '<li class="ml-6 text-purple-100/90 list-decimal">$1</li>')
      .replace(/\n\n/g, '</p><p class="mb-4 text-purple-100/90 leading-relaxed">')
      .replace(/\n/g, '<br />');
    
    if (!formatted.startsWith('<')) {
      formatted = `<p class="mb-4 text-purple-100/90 leading-relaxed">${formatted}</p>`;
    }
    
    return formatted;
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-black/40 backdrop-blur-xl rounded-3xl p-8 border border-purple-500/20">
        {title && (
          <div className="mb-8">
            <h2 className="text-3xl font-bold text-purple-200 mb-2">{title}</h2>
            <p className="text-purple-400 text-sm">
              Section {sectionNumber + 1} of {totalSections}
            </p>
            <div className="h-px bg-purple-500/30 mt-4" />
          </div>
        )}
        
        <div 
          className="prose prose-lg prose-invert max-w-none text-purple-100/90 leading-relaxed"
          dangerouslySetInnerHTML={{ __html: renderContent() }}
        />
      </div>
    </div>
  );
};