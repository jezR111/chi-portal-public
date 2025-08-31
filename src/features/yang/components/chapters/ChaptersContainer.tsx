import React, { useState } from 'react';
import { useChapterData } from '../../hooks/useChapterData';
import { useUserProgress } from '../../hooks/useUserProgress';
import { ChapterData } from '../../types/chapter.types';
import { BackgroundEffects } from './BackgroundEffects';
import { ChapterDetailModal } from './ChapterDetailModal';
import { ChapterGrid } from './ChapterGrid';
import { ProgressBar } from './ProgressBar';

interface ChaptersContainerProps {
  userId: string;
  onLessonStart?: (lessonId: string) => void;
  onInsightCapture?: (insight: any) => void;
  className?: string;
}

export const ChaptersContainer: React.FC<ChaptersContainerProps> = ({
  userId,
  onLessonStart,
  onInsightCapture,
  className = ''
}) => {
  const [selectedChapter, setSelectedChapter] = useState<ChapterData | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  const { chapters, loading, error } = useChapterData();
  const { progress, updateProgress } = useUserProgress(userId);
  
  const chaptersWithProgress = chapters.map(chapter => ({
    ...chapter,
    progress: progress[chapter.id]?.percentage || 0,
    unlocked: progress[chapter.id]?.unlocked ?? chapter.unlocked
  }));
  
  const handleChapterClick = (chapter: ChapterData) => {
    if (chapter.unlocked) {
      setSelectedChapter(chapter);
      setIsModalOpen(true);
    }
  };
  
  const handleModalClose = () => {
    setIsModalOpen(false);
    setTimeout(() => setSelectedChapter(null), 300);
  };
  
  const handleLessonStart = (lessonId: string) => {
    onLessonStart?.(lessonId);
    handleModalClose();
  };
  
  const overallProgress = calculateOverallProgress(chaptersWithProgress);
  
  if (loading) return <ChapterSkeleton />;
  if (error) return <ChapterError error={error} />;
  
  return (
    <div className={`relative min-h-screen ${className}`}>
      <BackgroundEffects />
      
      <div className="relative z-10">
        <ChapterHeader 
          title="Choose Your Path"
          subtitle="Each chapter builds upon the last, creating a complete journey"
        />
        
        <div className="p-8">
          <ChapterGrid 
            chapters={chaptersWithProgress}
            onChapterClick={handleChapterClick}
          />
          
          <div className="mt-12 max-w-2xl mx-auto">
            <ProgressBar 
              progress={overallProgress}
              level={progress.level || 1}
              xp={progress.totalXP || 0}
            />
          </div>
        </div>
      </div>
      
      {isModalOpen && selectedChapter && (
        <ChapterDetailModal
          chapter={selectedChapter}
          onClose={handleModalClose}
          onLessonStart={handleLessonStart}
          onInsightCapture={onInsightCapture}
        />
      )}
    </div>
  );
};

const ChapterHeader: React.FC<{ title: string; subtitle: string }> = ({ 
  title, 
  subtitle 
}) => (
  <header className="bg-black/20 backdrop-blur-xl border-b border-purple-500/20 p-6">
    <div className="max-w-7xl mx-auto">
      <h1 className="text-3xl font-bold text-white mb-1">{title}</h1>
      <p className="text-purple-300/80">{subtitle}</p>
    </div>
  </header>
);

const ChapterSkeleton: React.FC = () => (
  <div className="p-8">
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {[...Array(6)].map((_, i) => (
        <div key={i} className="bg-black/30 rounded-3xl h-64 animate-pulse" />
      ))}
    </div>
  </div>
);

const ChapterError: React.FC<{ error: Error }> = ({ error }) => (
  <div className="p-8 text-center">
    <p className="text-red-400">Error loading chapters: {error.message}</p>
  </div>
);

const calculateOverallProgress = (chapters: ChapterData[]): number => {
  const totalProgress = chapters.reduce((sum, ch) => sum + ch.progress, 0);
  return Math.round(totalProgress / chapters.length);
};

export default ChaptersContainer;