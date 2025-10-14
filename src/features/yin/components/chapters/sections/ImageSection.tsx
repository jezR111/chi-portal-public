// src/features/yin/components/chapters/sections/ImageSection.tsx
import { motion } from 'framer-motion';
import { Image as ImageIcon } from 'lucide-react';
import React from 'react';

interface ImageSectionProps {
  url: string;
  caption?: string;
  alt?: string;
}

export const ImageSection: React.FC<ImageSectionProps> = ({
  url,
  caption,
  alt
}) => {
  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: 0.2 }}
      className="max-w-4xl mx-auto"
    >
      <div className="relative group">
        <div className="absolute -inset-1 bg-gradient-to-r from-purple-600 to-pink-600 rounded-3xl opacity-20 blur-lg group-hover:opacity-30 transition duration-200" />
        
        <div className="relative bg-black/30 backdrop-blur-xl rounded-3xl p-4 border border-purple-500/20">
          <div className="relative overflow-hidden rounded-2xl">
            <img 
              src={url} 
              alt={alt || caption || 'Lesson image'} 
              className="w-full h-auto object-cover"
              loading="lazy"
            />
            
            {/* Optional overlay gradient */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent pointer-events-none" />
          </div>
          
          {caption && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="mt-4 flex items-center gap-2"
            >
              <ImageIcon className="w-4 h-4 text-purple-400" />
              <p className="text-purple-300 text-sm italic">{caption}</p>
            </motion.div>
          )}
        </div>
      </div>
    </motion.div>
  );
};