// src/features/yin/components/chapters/sections/VideoSection.tsx
import { motion } from 'framer-motion';
import { Play, Video } from 'lucide-react';
import React, { useState } from 'react';

interface VideoSectionProps {
  url: string;
  title?: string;
  duration?: number;
}

export const VideoSection: React.FC<VideoSectionProps> = ({
  url,
  title,
  duration
}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  
  // Convert YouTube URLs to embed format
  const getEmbedUrl = (videoUrl: string) => {
    if (videoUrl.includes('youtube.com/watch?v=')) {
      return videoUrl.replace('watch?v=', 'embed/');
    }
    if (videoUrl.includes('youtu.be/')) {
      return videoUrl.replace('youtu.be/', 'youtube.com/embed/');
    }
    return videoUrl;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-4xl mx-auto"
    >
      <div className="relative bg-black/40 backdrop-blur-xl rounded-3xl p-6 border border-purple-500/20">
        {title && (
          <div className="flex items-center gap-3 mb-4">
            <Video className="w-6 h-6 text-purple-400" />
            <h3 className="text-xl font-semibold text-white">{title}</h3>
            {duration && (
              <span className="text-purple-300 text-sm">({duration} min)</span>
            )}
          </div>
        )}
        
        <div className="relative aspect-video bg-black rounded-2xl overflow-hidden border-4 border-purple-500/20">
          {!isPlaying ? (
            <div 
              onClick={() => setIsPlaying(true)}
              className="absolute inset-0 bg-gradient-to-br from-purple-900/50 to-pink-900/50 flex items-center justify-center cursor-pointer group hover:from-purple-900/60 hover:to-pink-900/60 transition-all"
            >
              <motion.div
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                className="w-20 h-20 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center"
              >
                <Play className="w-10 h-10 text-white ml-1" />
              </motion.div>
            </div>
          ) : (
            <iframe
              className="w-full h-full"
              src={getEmbedUrl(url)}
              title={title || "Lesson Video"}
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          )}
        </div>
      </div>
    </motion.div>
  );
};