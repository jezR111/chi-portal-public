// src/features/yang/components/MountainProgress.tsx
export function MountainProgress({ currentLevel, totalLevels }: { 
  currentLevel: number; 
  totalLevels: number; 
}) {
  return (
    <div className="bg-black/30 rounded-xl p-6 border border-orange-500/20">
      <h3 className="text-orange-400 font-bold mb-4">Mountain Progress</h3>
      <p className="text-white">Level {currentLevel} of {totalLevels}</p>
      <div className="mt-4 h-2 bg-black/50 rounded-full">
        <div 
          className="h-full bg-gradient-to-r from-orange-500 to-red-500 rounded-full"
          style={{ width: `${(currentLevel / totalLevels) * 100}%` }}
        />
      </div>
    </div>
  );
}