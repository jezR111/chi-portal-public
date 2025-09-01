// src/features/yin/components/chapters/PathsView.tsx

import { motion } from 'framer-motion';
import { ChevronRight } from 'lucide-react';
import { useState } from 'react';
import { pathsData } from '../../data/pathsData';

export const PathsView = () => {
  const [selectedPath, setSelectedPath] = useState(null);
  const [selectedChapter, setSelectedChapter] = useState(null);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-purple-950/90 to-indigo-950">
      {/* Remove white/light overlays */}
      <div className="p-8">
        <h1 className="text-3xl font-bold text-purple-100 mb-8">Choose Your Path</h1>
        
        {/* Paths Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {pathsData.map((path) => (
            <motion.div
              key={path.id}
              whileHover={{ scale: 1.05 }}
              onClick={() => setSelectedPath(path)}
              className="cursor-pointer"
            >
              <div className={`relative bg-black/40 backdrop-blur-xl rounded-2xl border border-purple-500/30 p-6 hover:border-purple-400/50 transition-all`}>
                {/* Remove white, use deeper purple gradients */}
                <div className={`absolute inset-0 bg-gradient-to-br ${path.color} opacity-10 rounded-2xl`} />
                
                <div className={`w-16 h-16 bg-gradient-to-br ${path.color} rounded-xl flex items-center justify-center mb-4`}>
                  <path.icon className="w-8 h-8 text-purple-100" />
                </div>
                
                <h3 className="text-xl font-bold text-purple-100 mb-2">{path.title}</h3>
                <p className="text-purple-300/80 text-sm mb-4">{path.description}</p>
                
                <div className="flex items-center justify-between">
                  <span className="text-purple-400 text-sm">
                    {path.chapters.length} Chapters
                  </span>
                  <ChevronRight className="w-5 h-5 text-purple-400" />
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};