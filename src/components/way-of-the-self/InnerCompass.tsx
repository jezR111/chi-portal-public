// src/components/way-of-the-self/InnerCompass.tsx
'use client';

import {
  Brain,
  CheckCircle,
  ChevronLeft,
  ChevronRight,
  Compass,
  Flower2,
  Heart,
  LucideIcon,
  Mountain,
  Shield,
  Sparkles,
  Users,
  Zap
} from 'lucide-react';
import { useState } from 'react';

// Types
interface AssessmentOption {
  value: string;
  text: string;
  score: number;
}

interface AssessmentQuestion {
  id: number;
  category: string;
  question: string;
  options: AssessmentOption[];
}

interface GrowthAreaInfo {
  title: string;
  icon: LucideIcon;
  color: string;
  description: string;
}

interface GrowthMap {
  scores: Record<string, number>;
  focusAreas: string[];
  strengths: string[];
}

interface InnerCompassProps {
  onComplete?: (growthMap: GrowthMap) => void;
}

interface AssessmentResultsProps {
  growthMap: GrowthMap;
  onComplete?: (growthMap: GrowthMap) => void;
}

// Assessment questions mapped to core themes
const ASSESSMENT_QUESTIONS: AssessmentQuestion[] = [
  {
    id: 1,
    category: "self-worth",
    question: "When someone compliments you, what's your first instinct?",
    options: [
      { value: "accept", text: "I receive it with gratitude", score: 3 },
      { value: "deflect", text: "I deflect or minimize it", score: 1 },
      { value: "question", text: "I wonder what they want from me", score: 0 },
      { value: "analyze", text: "I evaluate if it's deserved", score: 2 }
    ]
  },
  {
    id: 2,
    category: "boundaries",
    question: "A friend asks for a favor when you're exhausted. You:",
    options: [
      { value: "yes-always", text: "Say yes - they need me", score: 0 },
      { value: "yes-guilty", text: "Say yes, but feel resentful", score: 1 },
      { value: "consider", text: "Consider my capacity first", score: 3 },
      { value: "no-explain", text: "Decline with a long explanation", score: 2 }
    ]
  },
  {
    id: 3,
    category: "emotional-regulation",
    question: "When intense emotions arise, you typically:",
    options: [
      { value: "suppress", text: "Push them down and carry on", score: 0 },
      { value: "express", text: "Express them immediately", score: 1 },
      { value: "observe", text: "Notice and sit with them", score: 3 },
      { value: "analyze", text: "Try to figure out why", score: 2 }
    ]
  },
  {
    id: 4,
    category: "connection",
    question: "In relationships, you tend to:",
    options: [
      { value: "merge", text: "Lose yourself in others", score: 0 },
      { value: "distance", text: "Keep people at arm's length", score: 1 },
      { value: "balance", text: "Maintain healthy interdependence", score: 3 },
      { value: "fluctuate", text: "Swing between closeness and distance", score: 2 }
    ]
  },
  {
    id: 5,
    category: "shadow-work",
    question: "When you notice a strong reaction to someone's behavior:",
    options: [
      { value: "judge", text: "I judge them for it", score: 0 },
      { value: "dismiss", text: "I ignore my reaction", score: 1 },
      { value: "curious", text: "I get curious about what it mirrors in me", score: 3 },
      { value: "uncomfortable", text: "I feel uncomfortable but don't explore it", score: 2 }
    ]
  }
];

const GROWTH_AREAS: Record<string, GrowthAreaInfo> = {
  "self-worth": {
    title: "Self-Worth & Identity",
    icon: Heart,
    color: "from-pink-500 to-rose-500",
    description: "Building authentic self-love and recognition"
  },
  "boundaries": {
    title: "Healthy Boundaries",
    icon: Shield,
    color: "from-blue-500 to-cyan-500",
    description: "Creating sacred space for your authentic self"
  },
  "emotional-regulation": {
    title: "Emotional Mastery",
    icon: Brain,
    color: "from-purple-500 to-indigo-500",
    description: "Navigating emotions with wisdom and grace"
  },
  "connection": {
    title: "Conscious Connection",
    icon: Users,
    color: "from-green-500 to-emerald-500",
    description: "Relating authentically with others"
  },
  "shadow-work": {
    title: "Shadow Integration",
    icon: Zap,
    color: "from-amber-500 to-orange-500",
    description: "Embracing all aspects of your being"
  }
};

export default function InnerCompass({ onComplete }: InnerCompassProps) {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [showResults, setShowResults] = useState(false);
  const [growthMap, setGrowthMap] = useState<GrowthMap | null>(null);
  const [selectedAnswer, setSelectedAnswer] = useState<AssessmentOption | null>(null);
  const [isTransitioning, setIsTransitioning] = useState(false);

  const progress = ((currentQuestion + 1) / ASSESSMENT_QUESTIONS.length) * 100;

  const handleAnswer = (answer: AssessmentOption) => {
    setSelectedAnswer(answer);
    setAnswers({
      ...answers,
      [ASSESSMENT_QUESTIONS[currentQuestion].category]: answer.score
    });

    setTimeout(() => {
      if (currentQuestion < ASSESSMENT_QUESTIONS.length - 1) {
        setIsTransitioning(true);
        setTimeout(() => {
          setCurrentQuestion(currentQuestion + 1);
          setSelectedAnswer(null);
          setIsTransitioning(false);
        }, 300);
      } else {
        calculateResults();
      }
    }, 500);
  };

  const calculateResults = () => {
    const categoryScores: Record<string, { total: number; count: number }> = {};
    
    // Calculate average score for each category
    Object.entries(answers).forEach(([category, score]) => {
      if (!categoryScores[category]) {
        categoryScores[category] = { total: 0, count: 0 };
      }
      categoryScores[category].total += score;
      categoryScores[category].count += 1;
    });

    const finalScores: Record<string, number> = {};
    Object.entries(categoryScores).forEach(([category, data]) => {
      finalScores[category] = (data.total / data.count) / 3 * 100; // Convert to percentage
    });

    // Identify focus areas (lowest scores)
    const sortedAreas = Object.entries(finalScores)
      .sort((a, b) => a[1] - b[1])
      .slice(0, 3)
      .map(([area]) => area);

    setGrowthMap({
      scores: finalScores,
      focusAreas: sortedAreas,
      strengths: Object.entries(finalScores)
        .filter(([_, score]) => score >= 75)
        .map(([area]) => area)
    });

    setShowResults(true);
  };

  const handleBack = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
      setSelectedAnswer(null);
    }
  };

  if (showResults && growthMap) {
    return <AssessmentResults growthMap={growthMap} onComplete={onComplete} />;
  }

  const question = ASSESSMENT_QUESTIONS[currentQuestion];
  const AreaIcon = GROWTH_AREAS[question.category].icon;

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 flex items-center justify-center p-4">
      <div className="max-w-2xl w-full">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center p-3 bg-white/10 backdrop-blur-xl rounded-2xl mb-4">
            <Compass className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">
            Inner Compass Assessment
          </h1>
          <p className="text-gray-300">
            Discovering your unique path to growth
          </p>
        </div>

        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex justify-between text-sm text-gray-400 mb-2">
            <span>Question {currentQuestion + 1} of {ASSESSMENT_QUESTIONS.length}</span>
            <span>{Math.round(progress)}% Complete</span>
          </div>
          <div className="h-2 bg-white/20 rounded-full overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-purple-500 to-pink-500 transition-all duration-500"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* Question Card */}
        <div className={`bg-white/10 backdrop-blur-xl rounded-3xl p-8 border border-white/20 transition-all duration-300 ${
          isTransitioning ? 'opacity-0 transform scale-95' : 'opacity-100 transform scale-100'
        }`}>
          <div className="mb-8">
            <div className="flex items-center gap-2 mb-4">
              <div className={`p-2 rounded-lg bg-gradient-to-r ${GROWTH_AREAS[question.category].color}`}>
                <AreaIcon className="w-5 h-5 text-white" />
              </div>
              <span className="text-sm text-gray-400">
                {GROWTH_AREAS[question.category].title}
              </span>
            </div>
            <h2 className="text-2xl font-semibold text-white">
              {question.question}
            </h2>
          </div>

          {/* Options */}
          <div className="space-y-3">
            {question.options.map((option) => (
              <button
                key={option.value}
                onClick={() => handleAnswer(option)}
                className={`w-full text-left p-4 rounded-xl transition-all ${
                  selectedAnswer?.value === option.value
                    ? 'bg-gradient-to-r from-purple-500 to-pink-500 scale-[1.02]'
                    : 'bg-white/5 hover:bg-white/10'
                } border border-white/10`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-white">{option.text}</span>
                  {selectedAnswer?.value === option.value && (
                    <CheckCircle className="w-5 h-5 text-white animate-scale-in" />
                  )}
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Navigation */}
        <div className="flex justify-between mt-6">
          <button
            onClick={handleBack}
            disabled={currentQuestion === 0}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-all ${
              currentQuestion === 0
                ? 'opacity-0 pointer-events-none'
                : 'text-white hover:bg-white/10'
            }`}
          >
            <ChevronLeft className="w-5 h-5" />
            Back
          </button>
        </div>
      </div>

      <style jsx>{`
        @keyframes scale-in {
          0% { transform: scale(0); }
          100% { transform: scale(1); }
        }
        .animate-scale-in {
          animation: scale-in 0.3s ease-out;
        }
      `}</style>
    </div>
  );
}

// Results Component
function AssessmentResults({ growthMap, onComplete }: AssessmentResultsProps) {
  const [selectedArea, setSelectedArea] = useState<string | null>(null);

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 p-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12 pt-8">
          <div className="inline-flex items-center justify-center p-3 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl mb-4">
            <Sparkles className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-white mb-4">
            Your Personal Growth Map
          </h1>
          <p className="text-gray-300 max-w-2xl mx-auto">
            Based on your responses, we've identified your unique growth path. 
            Your journey begins with understanding where you are now.
          </p>
        </div>

        {/* Growth Map Visualization */}
        <div className="grid md:grid-cols-2 gap-8 mb-12">
          {/* Radar Chart Placeholder */}
          <div className="bg-white/10 backdrop-blur-xl rounded-3xl p-8 border border-white/20">
            <h3 className="text-xl font-semibold text-white mb-6">Your Current Landscape</h3>
            <div className="relative h-64">
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center">
                  <Mountain className="w-16 h-16 text-purple-400 mx-auto mb-4" />
                  <p className="text-gray-400">Your unique growth terrain</p>
                </div>
              </div>
            </div>
            
            {/* Scores */}
            <div className="mt-6 space-y-3">
              {Object.entries(growthMap.scores).map(([area, score]) => {
                const areaInfo = GROWTH_AREAS[area];
                const Icon = areaInfo.icon;
                return (
                  <div key={area} className="flex items-center gap-3">
                    <div className={`p-2 rounded-lg bg-gradient-to-r ${areaInfo.color}`}>
                      <Icon className="w-4 h-4 text-white" />
                    </div>
                    <div className="flex-1">
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-gray-300">{areaInfo.title}</span>
                        <span className="text-white font-semibold">{Math.round(score)}%</span>
                      </div>
                      <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                        <div 
                          className={`h-full bg-gradient-to-r ${areaInfo.color} transition-all`}
                          style={{ width: `${score}%` }}
                        />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Focus Areas */}
          <div className="bg-white/10 backdrop-blur-xl rounded-3xl p-8 border border-white/20">
            <h3 className="text-xl font-semibold text-white mb-6">Your Focus Areas</h3>
            <p className="text-gray-400 mb-6">
              These areas offer the greatest opportunity for transformation:
            </p>
            
            <div className="space-y-4">
              {growthMap.focusAreas.map((area, index) => {
                const areaInfo = GROWTH_AREAS[area];
                const Icon = areaInfo.icon;
                return (
                  <div
                    key={area}
                    onClick={() => setSelectedArea(area)}
                    className="bg-white/5 rounded-xl p-4 border border-white/10 hover:bg-white/10 cursor-pointer transition-all"
                  >
                    <div className="flex items-start gap-3">
                      <div className={`p-2 rounded-lg bg-gradient-to-r ${areaInfo.color}`}>
                        <Icon className="w-5 h-5 text-white" />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-semibold text-white mb-1">
                          {index === 0 && "🎯 Primary Focus: "}
                          {areaInfo.title}
                        </h4>
                        <p className="text-sm text-gray-400">
                          {areaInfo.description}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Strengths */}
            {growthMap.strengths.length > 0 && (
              <div className="mt-6 p-4 bg-green-500/10 rounded-xl border border-green-500/30">
                <h4 className="text-green-400 font-semibold mb-2">Your Strengths</h4>
                <p className="text-sm text-gray-300">
                  You're already strong in: {growthMap.strengths.map(s => GROWTH_AREAS[s].title).join(", ")}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Next Steps */}
        <div className="bg-white/10 backdrop-blur-xl rounded-3xl p-8 border border-white/20 text-center">
          <Flower2 className="w-12 h-12 text-purple-400 mx-auto mb-4" />
          <h3 className="text-2xl font-semibold text-white mb-4">
            Your Journey Begins
          </h3>
          <p className="text-gray-300 mb-6 max-w-2xl mx-auto">
            Based on your assessment, we recommend starting with "The Self" chapter, 
            focusing on {GROWTH_AREAS[growthMap.focusAreas[0]].title.toLowerCase()}. 
            Your personalized path awaits.
          </p>
          
          <button
            onClick={() => onComplete?.(growthMap)}
            className="bg-gradient-to-r from-purple-500 to-pink-500 px-8 py-3 rounded-xl font-semibold hover:shadow-lg hover:shadow-purple-500/25 transition-all inline-flex items-center gap-2"
          >
            Begin Your Journey
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
}
