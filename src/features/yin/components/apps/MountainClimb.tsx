// src/features/yin/components/apps/MountainClimb.tsx
import {
  CheckCircle,
  ChevronLeft,
  Flag,
  Lock,
  Play,
  Target,
  Trophy
} from 'lucide-react';
import { useState } from 'react';

const MountainClimb = ({ 
  chapter = { 
    id: 'shadow-work', 
    title: 'Shadow Work', 
    description: 'Embrace and integrate your shadow self' 
  },
  lessons = [
    { id: '1', title: 'Introduction to Shadow Work', duration: 10, type: 'video', completed: true },
    { id: '2', title: 'Meeting Your Shadow', duration: 15, type: 'interactive', completed: true },
    { id: '3', title: 'Shadow Integration', duration: 20, type: 'reading', completed: false, current: true },
    { id: '4', title: 'Shadow Dialogue', duration: 25, type: 'video', completed: false },
    { id: '5', title: 'Living with Your Shadow', duration: 30, type: 'interactive', completed: false }
  ],
  onBack = () => {},
  onLessonSelect = () => {}
}) => {
  const [hoveredCamp, setHoveredCamp] = useState(null);
  const [selectedCamp, setSelectedCamp] = useState(null);
  const completedCount = lessons.filter(l => l.completed).length;
  const progress = (completedCount / lessons.length) * 100;
  const altitude = Math.round(3539 * (progress / 100));

  // Define path points for a winding mountain path
  const pathPoints = [
    { x: 15, y: 95 },  // Start bottom left
    { x: 35, y: 85 },  // First turn right
    { x: 20, y: 70 },  // Turn left
    { x: 45, y: 55 },  // Turn right middle
    { x: 30, y: 40 },  // Turn left upper
    { x: 50, y: 25 },  // Summit approach
    { x: 50, y: 15 }   // Summit
  ];

  // Position camps along the path
  const camps = lessons.map((lesson, index) => {
    const pathProgress = (index + 1) / (lessons.length + 1);
    const segmentIndex = Math.floor(pathProgress * (pathPoints.length - 1));
    const segmentProgress = (pathProgress * (pathPoints.length - 1)) % 1;
    
    const startPoint = pathPoints[segmentIndex];
    const endPoint = pathPoints[Math.min(segmentIndex + 1, pathPoints.length - 1)];
    
    const x = startPoint.x + (endPoint.x - startPoint.x) * segmentProgress;
    const y = startPoint.y + (endPoint.y - startPoint.y) * segmentProgress;
    
    return {
      id: lesson.id,
      name: `Camp ${index + 1}`,
      lesson: lesson,
      altitude: Math.round((index + 1) / lessons.length * 3539),
      position: { x, y },
      reached: lesson.completed,
      current: lesson.current
    };
  });

  return (
    <div className="relative w-full h-screen overflow-hidden bg-gradient-to-b from-indigo-950 via-purple-900 to-purple-950">
      {/* Sky Background with Stars */}
      <div className="absolute inset-0">
        {[...Array(80)].map((_, i) => (
          <div
            key={i}
            className="absolute rounded-full bg-white animate-pulse"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 60}%`,
              width: `${Math.random() * 2 + 0.5}px`,
              height: `${Math.random() * 2 + 0.5}px`,
              animationDelay: `${Math.random() * 3}s`,
              opacity: Math.random() * 0.6 + 0.2
            }}
          />
        ))}
      </div>

      {/* Mountain Layers - SVG */}
      <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
        <defs>
          {/* Gradients for mountain layers */}
          <linearGradient id="bgMountain1" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#4c1d95" stopOpacity="0.3" />
            <stop offset="100%" stopColor="#1e1b4b" stopOpacity="0.4" />
          </linearGradient>
          <linearGradient id="bgMountain2" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#5b21b6" stopOpacity="0.4" />
            <stop offset="100%" stopColor="#2e1065" stopOpacity="0.5" />
          </linearGradient>
          <linearGradient id="bgMountain3" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#6d28d9" stopOpacity="0.5" />
            <stop offset="100%" stopColor="#4c1d95" stopOpacity="0.6" />
          </linearGradient>
          <linearGradient id="mainMountain" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#8b5cf6" />
            <stop offset="30%" stopColor="#7c3aed" />
            <stop offset="70%" stopColor="#6d28d9" />
            <stop offset="100%" stopColor="#5b21b6" />
          </linearGradient>
          <linearGradient id="snowCap" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#ffffff" stopOpacity="0.95" />
            <stop offset="100%" stopColor="#e0e7ff" stopOpacity="0.8" />
          </linearGradient>
          <linearGradient id="pathGradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#fbbf24" stopOpacity="0.6" />
            <stop offset="100%" stopColor="#f59e0b" stopOpacity="0.4" />
          </linearGradient>
        </defs>

        {/* Background Mountains - More subtle */}
        <polygon
          points="0,100 15,50 30,55 45,45 60,52 75,42 90,48 100,65 100,100"
          fill="url(#bgMountain1)"
        />
        <polygon
          points="0,100 10,65 25,55 40,58 55,50 70,55 85,45 100,70 100,100"
          fill="url(#bgMountain2)"
        />
        <polygon
          points="0,100 20,70 35,62 50,58 65,62 80,52 95,60 100,75 100,100"
          fill="url(#bgMountain3)"
        />
        
        {/* Main Mountain - Larger and more dominant */}
        <polygon
          points="5,100 20,75 30,70 40,50 50,15 60,50 70,70 80,75 95,100"
          fill="url(#mainMountain)"
        />
        
        {/* Small Snow Cap - Just the peak */}
        <polygon
          points="45,25 50,15 55,25 52,22 50,20 48,22"
          fill="url(#snowCap)"
        />
        
        {/* Winding Mountain Path */}
        <path
          d={`M ${pathPoints[0].x},${pathPoints[0].y} 
              Q ${pathPoints[1].x},${pathPoints[1].y} ${pathPoints[2].x},${pathPoints[2].y}
              T ${pathPoints[3].x},${pathPoints[3].y}
              Q ${pathPoints[4].x},${pathPoints[4].y} ${pathPoints[5].x},${pathPoints[5].y}
              T ${pathPoints[6].x},${pathPoints[6].y}`}
          stroke="url(#pathGradient)"
          strokeWidth="1.5"
          fill="none"
          strokeLinecap="round"
          strokeDasharray="3 2"
          opacity="0.5"
        />
        
        {/* Progress Path Overlay */}
        <path
          d={`M ${pathPoints[0].x},${pathPoints[0].y} 
              Q ${pathPoints[1].x},${pathPoints[1].y} ${pathPoints[2].x},${pathPoints[2].y}
              T ${pathPoints[3].x},${pathPoints[3].y}
              Q ${pathPoints[4].x},${pathPoints[4].y} ${pathPoints[5].x},${pathPoints[5].y}
              T ${pathPoints[6].x},${pathPoints[6].y}`}
          stroke="#10b981"
          strokeWidth="2"
          fill="none"
          strokeLinecap="round"
          strokeDasharray="200"
          strokeDashoffset={200 - (progress * 2)}
          style={{
            filter: 'drop-shadow(0 0 8px rgba(16, 185, 129, 0.7))',
            transition: 'stroke-dashoffset 0.5s ease-out'
          }}
        />
      </svg>

      {/* Floating Clouds */}
      <div className="absolute top-20 left-10 animate-float opacity-30">
        <div className="w-32 h-16 bg-white/20 rounded-full blur-xl" />
      </div>
      <div className="absolute top-32 right-20 animate-float-delayed opacity-30">
        <div className="w-40 h-18 bg-white/20 rounded-full blur-xl" />
      </div>
      <div className="absolute top-48 left-1/2 animate-float opacity-25">
        <div className="w-36 h-14 bg-white/15 rounded-full blur-xl" />
      </div>

      {/* Camp Markers - Now positioned along the path */}
      <div className="absolute inset-0">
        {camps.map((camp, index) => (
          <div
            key={camp.id}
            className="absolute transform -translate-x-1/2 -translate-y-1/2 transition-all duration-300"
            style={{ 
              left: `${camp.position.x}%`, 
              top: `${camp.position.y}%`,
              zIndex: 20
            }}
            onMouseEnter={() => setHoveredCamp(camp)}
            onMouseLeave={() => setHoveredCamp(null)}
            onClick={() => {
              setSelectedCamp(camp);
              if (camp.reached || camp.current) {
                onLessonSelect(camp.lesson);
              }
            }}
          >
            {/* Camp Marker */}
            <div className={`
              relative cursor-pointer transform transition-all duration-300
              ${hoveredCamp?.id === camp.id ? 'scale-125' : ''}
              ${camp.current ? 'animate-pulse' : ''}
            `}>
              {camp.reached ? (
                <div className="relative">
                  <div className="w-12 h-12 bg-green-500/20 rounded-full absolute inset-0 blur-xl" />
                  <Trophy className="w-10 h-10 text-yellow-400 filter drop-shadow-lg relative z-10" />
                  <CheckCircle className="absolute -bottom-1 -right-1 w-4 h-4 text-green-400 bg-green-900 rounded-full" />
                </div>
              ) : camp.current ? (
                <div className="relative">
                  <div className="absolute inset-0 w-14 h-14 bg-amber-400/30 rounded-full blur-xl animate-pulse" />
                  <Target className="w-10 h-10 text-amber-400 relative z-10 filter drop-shadow-lg animate-pulse" />
                </div>
              ) : (
                <div className="relative opacity-70">
                  <Lock className="w-8 h-8 text-gray-400" />
                </div>
              )}
              
              {/* Camp Label */}
              <div className={`
                absolute top-full mt-2 left-1/2 transform -translate-x-1/2 
                text-xs font-bold whitespace-nowrap
                ${camp.reached ? 'text-green-400' : camp.current ? 'text-amber-400' : 'text-gray-400'}
              `}>
                Camp {index + 1}
              </div>
            </div>

            {/* Hover Card */}
            {hoveredCamp?.id === camp.id && (
              <div className="absolute bottom-full mb-3 left-1/2 transform -translate-x-1/2 z-50">
                <div className="bg-black/90 backdrop-blur-xl rounded-lg p-3 whitespace-nowrap border border-purple-500/50 shadow-xl">
                  <p className="text-white font-semibold text-sm">{camp.lesson.title}</p>
                  <p className="text-purple-300 text-xs mt-1">
                    {camp.lesson.duration} min • {camp.lesson.type}
                  </p>
                  <p className="text-amber-400 text-xs mt-1">
                    Altitude: {camp.altitude}m
                  </p>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Summit Flag */}
      <div className="absolute" style={{ left: '50%', top: '13%', transform: 'translateX(-50%)' }}>
        <div className="relative">
          <div className="absolute inset-0 w-12 h-12 bg-red-500/20 rounded-full blur-xl" />
          <Flag className="w-8 h-8 text-red-500 animate-wave relative z-10" />
        </div>
      </div>

      {/* Info Panel */}
      <div className="absolute top-4 left-4 bg-black/70 backdrop-blur-xl rounded-2xl p-6 border border-purple-500/30 max-w-sm">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-purple-300 hover:text-white transition-colors mb-4"
        >
          <ChevronLeft className="w-5 h-5" />
          Back to Chapters
        </button>
        
        <h2 className="text-2xl font-bold text-white mb-2">{chapter.title}</h2>
        <p className="text-purple-300 text-sm mb-4">{chapter.description}</p>
        
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-purple-400 text-sm">Altitude</span>
            <span className="text-white font-bold">{altitude}m / 3539m</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-purple-400 text-sm">Progress</span>
            <span className="text-white font-bold">{Math.round(progress)}% to Summit</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-purple-400 text-sm">Camps</span>
            <div className="flex items-center gap-1">
              <Trophy className="w-4 h-4 text-yellow-400" />
              <span className="text-white font-bold">{completedCount} / {lessons.length}</span>
            </div>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mt-6">
          <div className="h-2 bg-black/50 rounded-full overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-green-400 to-emerald-500 transition-all duration-500"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* Current Lesson Card */}
        {camps.find(c => c.current) && (
          <div className="mt-6 p-4 bg-amber-500/20 rounded-xl border border-amber-500/30">
            <div className="flex items-center gap-2 mb-2">
              <Target className="w-5 h-5 text-amber-400" />
              <p className="text-amber-400 font-semibold text-sm">Current Camp</p>
            </div>
            <p className="text-white font-medium">{camps.find(c => c.current).lesson.title}</p>
            <button 
              onClick={() => onLessonSelect(camps.find(c => c.current).lesson)}
              className="mt-3 w-full py-2 bg-amber-500 hover:bg-amber-400 text-black font-bold rounded-lg transition-colors flex items-center justify-center gap-2"
            >
              <Play className="w-4 h-4" />
              Continue Journey
            </button>
          </div>
        )}
      </div>

      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0) translateX(0); }
          50% { transform: translateY(-10px) translateX(10px); }
        }
        @keyframes float-delayed {
          0%, 100% { transform: translateY(0) translateX(0); }
          50% { transform: translateY(-15px) translateX(-10px); }
        }
        @keyframes wave {
          0%, 100% { transform: rotate(-5deg); }
          50% { transform: rotate(5deg); }
        }
        .animate-float {
          animation: float 6s ease-in-out infinite;
        }
        .animate-float-delayed {
          animation: float-delayed 8s ease-in-out infinite;
          animation-delay: 2s;
        }
        .animate-wave {
          animation: wave 2s ease-in-out infinite;
          transform-origin: bottom center;
        }
      `}</style>
    </div>
  );
};

export default MountainClimb;