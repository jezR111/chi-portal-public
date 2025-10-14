// src/features/yin/components/chapters/sections/TextSection.tsx
import { motion } from 'framer-motion';
import { Lightbulb, Sparkles } from 'lucide-react';
import React from 'react';

interface TextSectionProps {
  content: string;
  title?: string;
  sectionNumber: number;
  totalSections: number;
}

const renderFormattedContent = (content: string) => {
  if (!content) return '';
  
  let formatted = content
    .replace(/!\[(.*?)\]\((.*?)\)/g, '<img src="$2" alt="$1" class="my-6 rounded-2xl shadow-lg w-full h-auto object-cover border-4 border-purple-500/10" />')
    .replace(/^### (.*?)$/gm, '<h3 class="text-xl font-bold text-purple-200 mb-3 mt-6">$1</h3>')
    .replace(/^## (.*?)$/gm, '<h2 class="text-2xl font-bold text-white mb-4 mt-8">$1</h2>')
    .replace(/^# (.*?)$/gm, '<h1 class="text-3xl font-bold bg-gradient-to-r from-purple-200 to-pink-200 bg-clip-text text-transparent mb-6">$1</h1>')
    .replace(/\*\*(.*?)\*\*/g, '<strong class="font-bold text-purple-100">$1</strong>')
    .replace(/\*(.*?)\*/g, '<em class="italic text-purple-200">$1</em>')
    .replace(/^- (.*?)$/gm, '<li class="ml-6 text-purple-100/90 list-disc">$1</li>')
    .replace(/^\d+\. (.*?)$/gm, '<li class="ml-6 text-purple-100/90 list-decimal">$1</li>')
    .replace(/\n\n/g, '</p><p class="mb-4 text-purple-100/90 leading-relaxed">')
    .replace(/\n/g, '<br />');
  
  if (!formatted.startsWith('<')) {
    formatted = `<p class="mb-4 text-purple-100/90 leading-relaxed">${formatted}</p>`;
  }
  
  formatted = formatted.replace(/(<li class="ml-6 text-purple-100\/90 list-disc">.*?<\/li>\n?)+/g, 
    match => `<ul class="mb-4 space-y-2">${match}</ul>`);
  formatted = formatted.replace(/(<li class="ml-6 text-purple-100\/90 list-decimal">.*?<\/li>\n?)+/g, 
    match => `<ol class="mb-4 space-y-2">${match}</ol>`);
    
  return formatted;
};

export const TextSection: React.FC<TextSectionProps> = ({
  content,
  title,
  sectionNumber,
  totalSections
}) => {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
      className="relative"
    >
      <motion.div
        className="absolute -top-10 -left-10 w-20 h-20 bg-purple-500/10 rounded-full blur-2xl"
        animate={{ 
          x: [0, 30, 0],
          y: [0, -20, 0],
        }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute -bottom-10 -right-10 w-32 h-32 bg-pink-500/10 rounded-full blur-3xl"
        animate={{ 
          x: [0, -20, 0],
          y: [0, 30, 0],
        }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
      />
      
      <div className="relative">
        <div className="relative group">
          <div className="absolute -inset-0.5 bg-gradient-to-r from-purple-600 to-pink-600 rounded-3xl opacity-20 group-hover:opacity-30 blur transition duration-1000 group-hover:duration-200" />
          
          <div className="relative bg-black/40 backdrop-blur-xl rounded-3xl overflow-hidden">
            <motion.div 
              className="h-1 bg-gradient-to-r from-purple-600 via-pink-600 to-indigo-600"
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ duration: 1, delay: 0.5 }}
            />
            
            <div className="p-8 lg:p-10">
              {title && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="mb-8"
                >
                  <div className="flex items-center gap-4 mb-4">
                    <motion.div 
                      className="w-12 h-12 bg-gradient-to-br from-purple-600 to-pink-600 rounded-2xl flex items-center justify-center shadow-lg"
                      whileHover={{ scale: 1.1, rotate: 5 }}
                    >
                      <Lightbulb className="w-6 h-6 text-white" />
                    </motion.div>
                    <div>
                      <h2 className="text-3xl font-bold bg-gradient-to-r from-purple-200 to-pink-200 bg-clip-text text-transparent">
                        {title}
                      </h2>
                      <p className="text-purple-400 text-sm mt-1">
                        Section {sectionNumber + 1} of {totalSections}
                      </p>
                    </div>
                  </div>
                  <motion.div 
                    className="h-px bg-gradient-to-r from-transparent via-purple-500/30 to-transparent"
                    initial={{ scaleX: 0 }}
                    animate={{ scaleX: 1 }}
                    transition={{ duration: 0.8, delay: 0.4 }}
                  />
                </motion.div>
              )}
              
              <div className="prose prose-lg prose-invert max-w-none">
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.4 }}
                  className="text-purple-100/90 leading-relaxed space-y-6 select-text"
                  dangerouslySetInnerHTML={{ __html: renderFormattedContent(content) }}
                />
              </div>
              
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1 }}
                className="mt-8 p-4 bg-gradient-to-r from-purple-600/10 to-pink-600/10 rounded-2xl border border-purple-500/20"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-amber-500/20 rounded-lg flex items-center justify-center">
                    <Sparkles className="w-4 h-4 text-amber-400" />
                  </div>
                  <p className="text-purple-300 text-sm">
                    Pro tip: Highlight any text to capture it as an insight
                  </p>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};