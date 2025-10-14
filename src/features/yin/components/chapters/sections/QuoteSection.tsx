// src/features/yin/components/chapters/sections/QuoteSection.tsx
import { motion } from 'framer-motion';
import { Quote } from 'lucide-react';
import React from 'react';

interface QuoteSectionProps {
  content: string;
  author?: string;
}

export const QuoteSection: React.FC<QuoteSectionProps> = ({
  content,
  author
}) => {
  return (
    <motion.div
      initial={{ scale: 0.9, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
      className="relative max-w-4xl mx-auto"
    >
      <div className="absolute inset-0 bg-gradient-to-r from-purple-600/10 via-pink-600/10 to-indigo-600/10 blur-3xl" />
      
      <div className="relative bg-gradient-to-br from-purple-900/30 to-pink-900/30 backdrop-blur-xl rounded-3xl p-10 border border-purple-500/20">
        <Quote className="absolute top-6 left-6 w-8 h-8 text-purple-500/30" />
        <Quote className="absolute bottom-6 right-6 w-8 h-8 text-purple-500/30 rotate-180" />
        
        <div className="relative z-10">
          <p className="text-2xl md:text-3xl font-light text-transparent bg-clip-text bg-gradient-to-r from-purple-200 via-pink-200 to-indigo-200 italic leading-relaxed text-center">
            {content}
          </p>
          {author && (
            <p className="text-purple-400 text-center mt-6 text-lg">
              — {author}
            </p>
          )}
        </div>
      </div>
    </motion.div>
  );
};