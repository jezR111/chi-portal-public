// app/components/way-of-the-self/GrowthGarden.tsx

import {
  Activity,
  Brain,
  CloudRain,
  Droplets,
  Flower,
  Flower2,
  Heart,
  Moon,
  Shield,
  Sparkles,
  Star,
  Sun,
  Sunrise,
  TreePine,
  Users,
  Wind
} from 'lucide-react';
import React, { useEffect, useRef, useState } from 'react';

// Plant types representing different aspects of growth
const PLANT_TYPES = {
  'self-worth': {
    icon: Flower,
    name: 'Rose of Self-Love',
    color: 'text-pink-400',
    glow: 'shadow-pink-400/50',
    description: 'Blooms with self-acceptance and compassion'
  },
  'boundaries': {
    icon: Shield,
    name: 'Guardian Fern',
    color: 'text-blue-400',
    glow: 'shadow-blue-400/50',
    description: 'Protects your sacred space'
  },
  'emotional-mastery': {
    icon: Brain,
    name: 'Wisdom Tree',
    color: 'text-purple-400',
    glow: 'shadow-purple-400/50',
    description: 'Grows with emotional intelligence'
  },
  'connection': {
    icon: Users,
    name: 'Harmony Vine',
    color: 'text-green-400',
    glow: 'shadow-green-400/50',
    description: 'Connects and intertwines with others'
  },
  'shadow-work': {
    icon: Moon,
    name: 'Shadow Lotus',
    color: 'text-indigo-400',
    glow: 'shadow-indigo-400/50',
    description: 'Blooms in darkness, bringing light'
  },
  'purpose': {
    icon: Star,
    name: 'North Star Blossom',
    color: 'text-yellow-400',
    glow: 'shadow-yellow-400/50',
    description: 'Points toward your true calling'
  }
};

// Activities that nurture the garden
const NURTURE_ACTIVITIES = {
  meditation: { icon: Sunrise, water: 10, sun: 5 },
  journaling: { icon: Brain, water: 5, sun: 10 },
  exercise: { icon: Activity, water: 8, sun: 8 },
  reading: { icon: TreePine, water: 3, sun: 7 },
  connection: { icon: Heart, water: 7, sun: 6 }
};

export default function GrowthGarden({ 
  userData = {
    completedChapters: [],
    dailyActivities: {},
    journalEntries: 0,
    meditationMinutes: 0,
    habitStreak: 0
  },
  onPlantClick
}) {
  const [plants, setPlants] = useState([]);
  const [gardenHealth, setGardenHealth] = useState(75);
  const [selectedPlant, setSelectedPlant] = useState(null);
  const [timeOfDay, setTimeOfDay] = useState('day');
  const [weatherMood, setWeatherMood] = useState('sunny');
  const [animateGrowth, setAnimateGrowth] = useState(false);
  const gardenRef = useRef(null);

  // Initialize garden based on user progress
  useEffect(() => {
    const userPlants = generateUserPlants(userData);
    setPlants(userPlants);
    calculateGardenHealth(userData);
  }, [userData]);

  // Time of day cycle
  useEffect(() => {
    const hour = new Date().getHours();
    if (hour >= 6 && hour < 12) setTimeOfDay('morning');
    else if (hour >= 12 && hour < 17) setTimeOfDay('afternoon');
    else if (hour >= 17 && hour < 21) setTimeOfDay('evening');
    else setTimeOfDay('night');
  }, []);

  const generateUserPlants = (data) => {
    const userPlants = [];
    
    // Add plants based on completed chapters
    data.completedChapters?.forEach((chapter) => {
      if (PLANT_TYPES[chapter]) {
        userPlants.push({
          id: chapter,
          type: chapter,
          growth: 100,
          position: getRandomPosition(),
          plantedDate: new Date().toISOString()
        });
      }
    });

    // Add seedlings based on current focus areas
    if (data.focusAreas) {
      data.focusAreas.forEach((area, index) => {
        if (PLANT_TYPES[area] && !userPlants.find(p => p.id === area)) {
          userPlants.push({
            id: area,
            type: area,
            growth: 20 + (index * 10), // Varying growth stages
            position: getRandomPosition(),
            plantedDate: new Date().toISOString()
          });
        }
      });
    }

    return userPlants;
  };

  const getRandomPosition = () => ({
    x: 20 + Math.random() * 60,
    y: 30 + Math.random() * 40
  });

  const calculateGardenHealth = (data) => {
    let health = 50; // Base health
    
    // Add health based on activities
    if (data.meditationMinutes > 0) health += Math.min(20, data.meditationMinutes / 10);
    if (data.journalEntries > 0) health += Math.min(15, data.journalEntries * 3);
    if (data.habitStreak > 0) health += Math.min(15, data.habitStreak * 2);
    
    setGardenHealth(Math.min(100, health));
    
    // Update weather based on health
    if (health > 80) setWeatherMood('sunny');
    else if (health > 60) setWeatherMood('partly-cloudy');
    else if (health > 40) setWeatherMood('cloudy');
    else setWeatherMood('needs-water');
  };

  const waterGarden = () => {
    setAnimateGrowth(true);
    setWeatherMood('raining');
    
    // Grow all plants slightly
    setPlants(prev => prev.map(plant => ({
      ...plant,
      growth: Math.min(100, plant.growth + 5)
    })));

    setTimeout(() => {
      setWeatherMood('sunny');
      setAnimateGrowth(false);
    }, 2000);
  };

  // Sky gradient based on time of day
  const skyGradients = {
    morning: 'from-orange-300 via-pink-300 to-blue-400',
    afternoon: 'from-blue-400 via-blue-500 to-blue-600',
    evening: 'from-purple-400 via-pink-400 to-orange-400',
    night: 'from-indigo-900 via-purple-900 to-black'
  };

  // Ground gradient
  const groundGradient = gardenHealth > 70 
    ? 'from-green-600 via-green-500 to-green-400'
    : gardenHealth > 40
    ? 'from-green-700 via-green-600 to-yellow-600'
    : 'from-yellow-700 via-yellow-600 to-brown-600';

  return (
    <div className="relative w-full h-full min-h-[600px] rounded-3xl overflow-hidden">
      {/* Sky */}
      <div className={`absolute inset-0 bg-gradient-to-b ${skyGradients[timeOfDay]} transition-all duration-1000`}>
        {/* Sun/Moon */}
        <div className="absolute top-8 right-8">
          {timeOfDay === 'night' ? (
            <Moon className="w-12 h-12 text-yellow-100 animate-pulse" />
          ) : (
            <Sun className="w-12 h-12 text-yellow-300 animate-spin-slow" />
          )}
        </div>

        {/* Weather */}
        {weatherMood === 'raining' && (
          <div className="absolute inset-0">
            <CloudRain className="absolute top-4 left-1/4 w-16 h-16 text-gray-400 animate-float" />
            <Droplets className="absolute top-20 left-1/3 w-8 h-8 text-blue-400 animate-fall" />
            <Droplets className="absolute top-20 right-1/3 w-8 h-8 text-blue-400 animate-fall-delayed" />
          </div>
        )}

        {weatherMood === 'partly-cloudy' && (
          <Wind className="absolute top-12 left-1/2 w-12 h-12 text-white/30 animate-float-slow" />
        )}

        {/* Stars at night */}
        {timeOfDay === 'night' && (
          <div className="absolute inset-0">
            {[...Array(20)].map((_, i) => (
              <Star
                key={i}
                className="absolute text-white animate-twinkle"
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 50}%`,
                  fontSize: `${Math.random() * 8 + 4}px`,
                  animationDelay: `${Math.random() * 3}s`
                }}
              />
            ))}
          </div>
        )}
      </div>

      {/* Ground */}
      <div className={`absolute bottom-0 left-0 right-0 h-2/3 bg-gradient-to-t ${groundGradient} transition-all duration-1000`}>
        {/* Garden Grid Pattern */}
        <svg className="absolute inset-0 w-full h-full opacity-10">
          <defs>
            <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 0 0 40" fill="none" stroke="white" strokeWidth="1"/>
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />
        </svg>

        {/* Plants */}
        <div ref={gardenRef} className="absolute inset-0">
          {plants.map((plant) => {
            const PlantType = PLANT_TYPES[plant.type];
            const PlantIcon = PlantType.icon;
            const scale = 0.3 + (plant.growth / 100) * 0.7;
            
            return (
              <div
                key={plant.id}
                className={`absolute transform -translate-x-1/2 -translate-y-1/2 transition-all duration-500 ${
                  animateGrowth ? 'animate-grow' : ''
                }`}
                style={{
                  left: `${plant.position.x}%`,
                  top: `${plant.position.y}%`,
                  transform: `translate(-50%, -50%) scale(${scale})`
                }}
              >
                <button
                  onClick={() => setSelectedPlant(plant)}
                  className="group relative"
                >
                  {/* Glow effect */}
                  <div className={`absolute inset-0 rounded-full blur-xl ${PlantType.glow} opacity-50 group-hover:opacity-75 transition-opacity`} />
                  
                  {/* Plant */}
                  <PlantIcon 
                    className={`relative w-12 h-12 ${PlantType.color} drop-shadow-lg transition-transform group-hover:scale-110`}
                  />
                  
                  {/* Growth particles */}
                  {plant.growth === 100 && (
                    <Sparkles className="absolute -top-2 -right-2 w-4 h-4 text-yellow-400 animate-pulse" />
                  )}
                </button>
              </div>
            );
          })}
        </div>
      </div>

      {/* Garden Stats Overlay */}
      <div className="absolute top-4 left-4 bg-black/30 backdrop-blur-md rounded-2xl p-4">
        <h3 className="text-white font-semibold mb-3 flex items-center gap-2">
          <Flower2 className="w-5 h-5" />
          Your Growth Garden
        </h3>
        
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-white/80">Garden Health</span>
            <div className="flex items-center gap-2">
              <div className="w-24 h-2 bg-white/20 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-green-400 to-emerald-400 transition-all"
                  style={{ width: `${gardenHealth}%` }}
                />
              </div>
              <span className="text-white font-medium text-xs">{gardenHealth}%</span>
            </div>
          </div>
          
          <div className="flex items-center justify-between text-sm">
            <span className="text-white/80">Plants</span>
            <span className="text-white font-medium">{plants.length}</span>
          </div>
          
          <div className="flex items-center justify-between text-sm">
            <span className="text-white/80">Bloom Stage</span>
            <span className="text-white font-medium">
              {plants.filter(p => p.growth === 100).length}/{plants.length}
            </span>
          </div>
        </div>

        {/* Nurture Actions */}
        <div className="mt-4 pt-4 border-t border-white/20">
          <p className="text-white/60 text-xs mb-2">Nurture Your Garden</p>
          <div className="flex gap-2">
            <button
              onClick={waterGarden}
              className="p-2 bg-blue-500/20 hover:bg-blue-500/30 rounded-lg transition-colors group"
            >
              <Droplets className="w-4 h-4 text-blue-400 group-hover:scale-110 transition-transform" />
            </button>
            <button className="p-2 bg-yellow-500/20 hover:bg-yellow-500/30 rounded-lg transition-colors group">
              <Sun className="w-4 h-4 text-yellow-400 group-hover:scale-110 transition-transform" />
            </button>
            <button className="p-2 bg-purple-500/20 hover:bg-purple-500/30 rounded-lg transition-colors group">
              <Sparkles className="w-4 h-4 text-purple-400 group-hover:scale-110 transition-transform" />
            </button>
          </div>
        </div>
      </div>

      {/* Plant Details Modal */}
      {selectedPlant && (
        <div className="absolute inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-6 max-w-md w-full border border-white/20">
            <div className="flex items-start gap-4">
              <div className={`p-3 rounded-xl bg-gradient-to-br ${
                PLANT_TYPES[selectedPlant.type].color.replace('text-', 'from-').replace('400', '500')
              } to-transparent`}>
                {React.createElement(PLANT_TYPES[selectedPlant.type].icon, {
                  className: "w-8 h-8 text-white"
                })}
              </div>
              
              <div className="flex-1">
                <h3 className="text-xl font-semibold text-white mb-1">
                  {PLANT_TYPES[selectedPlant.type].name}
                </h3>
                <p className="text-white/60 text-sm mb-4">
                  {PLANT_TYPES[selectedPlant.type].description}
                </p>
                
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-white/60">Growth</span>
                    <span className="text-white font-medium">{selectedPlant.growth}%</span>
                  </div>
                  <div className="h-2 bg-white/20 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-gradient-to-r from-green-400 to-emerald-400"
                      style={{ width: `${selectedPlant.growth}%` }}
                    />
                  </div>
                </div>
                
                <button
                  onClick={() => setSelectedPlant(null)}
                  className="mt-4 w-full bg-white/20 hover:bg-white/30 py-2 rounded-lg text-white font-medium transition-colors"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0) translateX(0); }
          50% { transform: translateY(-10px) translateX(5px); }
        }
        @keyframes float-slow {
          0%, 100% { transform: translateY(0) translateX(0); }
          50% { transform: translateY(-15px) translateX(10px); }
        }
        @keyframes twinkle {
          0%, 100% { opacity: 0.3; }
          50% { opacity: 1; }
        }
        @keyframes spin-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        @keyframes grow {
          0%, 100% { transform: translate(-50%, -50%) scale(1); }
          50% { transform: translate(-50%, -50%) scale(1.1); }
        }
        @keyframes fall {
          from { transform: translateY(-20px); opacity: 0; }
          to { transform: translateY(100vh); opacity: 1; }
        }
        @keyframes fall-delayed {
          from { transform: translateY(-20px); opacity: 0; }
          to { transform: translateY(100vh); opacity: 1; }
        }
        .animate-float { animation: float 4s ease-in-out infinite; }
        .animate-float-slow { animation: float-slow 6s ease-in-out infinite; }
        .animate-twinkle { animation: twinkle 3s ease-in-out infinite; }
        .animate-spin-slow { animation: spin-slow 30s linear infinite; }
        .animate-grow { animation: grow 0.5s ease-in-out; }
        .animate-fall { animation: fall 2s linear infinite; }
        .animate-fall-delayed { 
          animation: fall 2s linear infinite;
          animation-delay: 1s;
        }
      `}</style>
    </div>
  );
}