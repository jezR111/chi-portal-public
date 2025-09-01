// src/features/yin/components/insights/VoiceNoteRecorder.tsx

import { AnimatePresence, motion } from 'framer-motion';
import { Check, Mic, MicOff, Pause, Play, RotateCcw } from 'lucide-react';
import React, { useEffect, useRef, useState } from 'react';

interface VoiceNoteRecorderProps {
  onRecordingComplete: (blob: Blob) => void;
  isRecording: boolean;
  setIsRecording: (recording: boolean) => void;
  maxDuration?: number; // in seconds
}

export const VoiceNoteRecorder: React.FC<VoiceNoteRecorderProps> = ({
  onRecordingComplete,
  isRecording,
  setIsRecording,
  maxDuration = 120
}) => {
  const [isPaused, setIsPaused] = useState(false);
  const [duration, setDuration] = useState(0);
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  
  useEffect(() => {
    if (isRecording && !isPaused) {
      timerRef.current = setInterval(() => {
        setDuration(prev => {
          if (prev >= maxDuration) {
            stopRecording();
            return prev;
          }
          return prev + 1;
        });
      }, 1000);
    } else {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    }
    
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [isRecording, isPaused, maxDuration]);
  
  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      chunksRef.current = [];
      
      mediaRecorder.ondataavailable = (event) => {
        chunksRef.current.push(event.data);
      };
      
      mediaRecorder.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: 'audio/webm' });
        setAudioBlob(blob);
        setAudioUrl(URL.createObjectURL(blob));
        onRecordingComplete(blob);
        
        // Stop all tracks
        stream.getTracks().forEach(track => track.stop());
      };
      
      mediaRecorder.start();
      setIsRecording(true);
      setDuration(0);
    } catch (error) {
      console.error('Error accessing microphone:', error);
      alert('Unable to access microphone. Please check your permissions.');
    }
  };
  
  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      setIsPaused(false);
    }
  };
  
  const pauseRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      if (isPaused) {
        mediaRecorderRef.current.resume();
        setIsPaused(false);
      } else {
        mediaRecorderRef.current.pause();
        setIsPaused(true);
      }
    }
  };
  
  const resetRecording = () => {
    setAudioBlob(null);
    setAudioUrl(null);
    setDuration(0);
    setIsRecording(false);
    setIsPaused(false);
    chunksRef.current = [];
  };
  
  const playAudio = () => {
    if (audioUrl && audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
        setIsPlaying(false);
      } else {
        audioRef.current.play();
        setIsPlaying(true);
      }
    }
  };
  
  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };
  
  return (
    <div className="space-y-4">
      <label className="text-white text-sm font-medium block">
        Voice Note (Optional)
      </label>
      
      {/* Recording Controls */}
      <div className="bg-black/30 border border-purple-500/20 rounded-xl p-4">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-4">
            {!audioBlob ? (
              <>
                {/* Record Button */}
                <motion.button
                  onClick={isRecording ? stopRecording : startRecording}
                  className={`w-12 h-12 rounded-full flex items-center justify-center transition-all ${
                    isRecording
                      ? 'bg-red-500 hover:bg-red-600'
                      : 'bg-purple-600 hover:bg-purple-700'
                  }`}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {isRecording ? (
                    <motion.div
                      animate={{ scale: [1, 1.2, 1] }}
                      transition={{ duration: 1, repeat: Infinity }}
                    >
                      <MicOff className="w-6 h-6 text-white" />
                    </motion.div>
                  ) : (
                    <Mic className="w-6 h-6 text-white" />
                  )}
                </motion.button>
                
                {/* Pause Button */}
                {isRecording && (
                  <motion.button
                    onClick={pauseRecording}
                    className="w-10 h-10 bg-gray-700 rounded-full flex items-center justify-center hover:bg-gray-600 transition-colors"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                  >
                    {isPaused ? (
                      <Play className="w-5 h-5 text-white ml-0.5" />
                    ) : (
                      <Pause className="w-5 h-5 text-white" />
                    )}
                  </motion.button>
                )}
              </>
            ) : (
              <>
                {/* Play Button */}
                <motion.button
                  onClick={playAudio}
                  className="w-12 h-12 bg-purple-600 rounded-full flex items-center justify-center hover:bg-purple-700 transition-colors"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {isPlaying ? (
                    <Pause className="w-6 h-6 text-white" />
                  ) : (
                    <Play className="w-6 h-6 text-white ml-0.5" />
                  )}
                </motion.button>
                
                {/* Reset Button */}
                <motion.button
                  onClick={resetRecording}
                  className="w-10 h-10 bg-gray-700 rounded-full flex items-center justify-center hover:bg-gray-600 transition-colors"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <RotateCcw className="w-5 h-5 text-white" />
                </motion.button>
                
                {/* Confirm Button */}
                <motion.button
                  className="w-10 h-10 bg-green-600 rounded-full flex items-center justify-center"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Check className="w-5 h-5 text-white" />
                </motion.button>
              </>
            )}
          </div>
          
          {/* Duration Display */}
          <div className="text-white font-mono">
            {formatTime(duration)} / {formatTime(maxDuration)}
          </div>
        </div>
        
        {/* Audio Waveform Visualization */}
        <div className="relative h-16 bg-black/30 rounded-lg overflow-hidden">
          {isRecording && (
            <div className="absolute inset-0 flex items-center justify-center gap-1">
              {[...Array(20)].map((_, i) => (
                <motion.div
                  key={i}
                  className="w-1 bg-purple-500 rounded-full"
                  animate={{
                    height: isPaused ? '20%' : ['20%', '80%', '20%']
                  }}
                  transition={{
                    duration: 0.5 + Math.random() * 0.5,
                    repeat: Infinity,
                    delay: i * 0.05
                  }}
                />
              ))}
            </div>
          )}
          
          {audioBlob && !isRecording && (
            <div className="absolute inset-0 flex items-center justify-center">
              <p className="text-purple-300 text-sm">Voice note recorded • {formatTime(duration)}</p>
            </div>
          )}
        </div>
        
        {/* Hidden Audio Element */}
        {audioUrl && (
          <audio
            ref={audioRef}
            src={audioUrl}
            onEnded={() => setIsPlaying(false)}
            className="hidden"
          />
        )}
      </div>
      
      {/* Status Messages */}
      <AnimatePresence>
        {isRecording && (
          <motion.p
            className="text-purple-300 text-sm text-center"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
          >
            {isPaused ? 'Recording paused' : 'Recording in progress...'}
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  );
};

export default VoiceNoteRecorder;