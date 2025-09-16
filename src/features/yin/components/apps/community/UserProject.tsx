// /features/yin/components/apps/community/UserProfile.tsx
import { supabase } from '@/lib/supabase';
import { motion } from 'framer-motion';
import { ChevronRight, Sparkles } from 'lucide-react';
import { useState } from 'react';

interface UserProfileProps {
  onComplete: () => void;
}

const avatarColors = [
  'from-purple-500 to-pink-500',
  'from-blue-500 to-cyan-500',
  'from-green-500 to-emerald-500',
  'from-amber-500 to-orange-500',
  'from-red-500 to-rose-500',
  'from-indigo-500 to-purple-500',
];

export default function UserProfile({ onComplete }: UserProfileProps) {
  const [username, setUsername] = useState('');
  const [bio, setBio] = useState('');
  const [selectedColor, setSelectedColor] = useState(avatarColors[0]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const createProfile = async () => {
    if (!username.trim()) {
      setError('Please enter a username');
      return;
    }

    setIsLoading(true);
    setError('');

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      setError('Please log in to continue');
      setIsLoading(false);
      return;
    }

    const { error: profileError } = await supabase
      .from('community_profiles')
      .insert({
        user_id: user.id,
        username: username.trim(),
        bio: bio.trim(),
        avatar_color: selectedColor,
        journey_level: 1
      });

    if (profileError) {
      if (profileError.message.includes('duplicate')) {
        setError('Username already taken. Please choose another.');
      } else {
        setError('Failed to create profile. Please try again.');
      }
      setIsLoading(false);
      return;
    }

    onComplete();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900/20 to-gray-900 
                  flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-gray-800/50 backdrop-blur-sm border border-purple-500/30 
                 rounded-2xl p-8 max-w-md w-full"
      >
        <div className="text-center mb-6">
          <div className="inline-flex p-3 bg-purple-500/20 rounded-full mb-4">
            <Sparkles className="w-8 h-8 text-purple-400" />
          </div>
          <h2 className="text-2xl font-bold text-white mb-2">
            Welcome to the Community
          </h2>
          <p className="text-gray-400 text-sm">
            Create your seeker profile to join the sanctuary
          </p>
        </div>

        {/* Avatar Preview */}
        <div className="flex justify-center mb-6">
          <div className={`w-20 h-20 rounded-full bg-gradient-to-br ${selectedColor} 
                        flex items-center justify-center text-white text-2xl font-bold`}>
            {username ? username[0].toUpperCase() : '?'}
          </div>
        </div>

        {/* Avatar Color Selection */}
        <div className="mb-6">
          <label className="text-sm text-gray-400 mb-2 block">Choose Your Aura</label>
          <div className="flex justify-center gap-2">
            {avatarColors.map((color) => (
              <button
                key={color}
                onClick={() => setSelectedColor(color)}
                className={`w-10 h-10 rounded-full bg-gradient-to-br ${color} 
                         transition-all ${selectedColor === color ? 'scale-110 ring-2 ring-white/50' : ''}`}
              />
            ))}
          </div>
        </div>

        {/* Username Input */}
        <div className="mb-4">
          <label className="text-sm text-gray-400 mb-2 block">Username</label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Choose your seeker name"
            maxLength={20}
            className="w-full bg-gray-900/50 text-white placeholder-gray-500 px-4 py-3 
                     rounded-lg border border-purple-500/30 focus:border-purple-500/50 
                     focus:outline-none"
          />
        </div>

        {/* Bio Input */}
        <div className="mb-6">
          <label className="text-sm text-gray-400 mb-2 block">
            Bio <span className="text-gray-600">(optional)</span>
          </label>
          <textarea
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            placeholder="Share a bit about your journey..."
            maxLength={200}
            rows={3}
            className="w-full bg-gray-900/50 text-white placeholder-gray-500 px-4 py-3 
                     rounded-lg border border-purple-500/30 focus:border-purple-500/50 
                     focus:outline-none resize-none"
          />
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-4 p-3 bg-red-500/20 border border-red-500/30 rounded-lg">
            <p className="text-sm text-red-400">{error}</p>
          </div>
        )}

        {/* Submit Button */}
        <button
          onClick={createProfile}
          disabled={isLoading || !username.trim()}
          className="w-full px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 
                   hover:from-purple-600 hover:to-pink-600 disabled:opacity-50 
                   disabled:cursor-not-allowed text-white rounded-lg transition-all 
                   flex items-center justify-center gap-2 font-medium"
        >
          {isLoading ? (
            <>
              <div className="w-4 h-4 border-2 border-white/30 border-t-white 
                          rounded-full animate-spin" />
              Creating Profile...
            </>
          ) : (
            <>
              Enter Sanctuary
              <ChevronRight className="w-4 h-4" />
            </>
          )}
        </button>
      </motion.div>
    </div>
  );
}