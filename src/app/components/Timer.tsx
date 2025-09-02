'use client';

import { useState, useEffect, useRef, useCallback } from 'react';

interface TimerProps {
  isRunning: boolean;
  isRestPeriod: boolean;
  roundTime: number;
  restTime: number;
  currentRound: number;
  totalRounds: number;
  onComplete: () => void;
  customSounds: { [key: string]: string };
}

export function Timer({
  isRunning,
  isRestPeriod,
  roundTime,
  restTime,
  currentRound,
  totalRounds,
  onComplete,
  customSounds
}: TimerProps) {
  const [timeLeft, setTimeLeft] = useState(roundTime);
  const [hasCompleted, setHasCompleted] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const timeLeftRef = useRef(timeLeft);
  const hasPlayedBellRef = useRef(false);

  // Play sound function
  const playSound = useCallback((soundType: string) => {
    // Try custom sound first
    if (customSounds[soundType]) {
      const audio = new Audio(customSounds[soundType]);
      audio.play().catch(console.error);
    } else {
      // Try to load default sound files
      const audio = new Audio();
      let soundFile = '';
      
      switch (soundType) {
        case 'bell':
          soundFile = '/sounds/bell.mp3';
          break;
        case 'start':
          soundFile = '/sounds/start.mp3';
          break;
        default:
          soundFile = '/sounds/bell.mp3';
      }
      
      audio.src = soundFile;
      audio.play().catch((error) => {
        console.log(`Could not play ${soundType} sound:`, error.message);
      });
    }
  }, [customSounds]);

  // Reset timer when round/rest time changes or when timer is stopped
  useEffect(() => {
    if (!isRunning) {
      // Reset to initial state when timer is stopped
      setTimeLeft(roundTime);
      setHasCompleted(false);
      hasPlayedBellRef.current = false;
    } else {
      // Set time based on current period
      setTimeLeft(isRestPeriod ? restTime : roundTime);
      hasPlayedBellRef.current = false;
    }
  }, [isRestPeriod, restTime, roundTime, isRunning]);

  // Update ref when timeLeft changes
  useEffect(() => {
    timeLeftRef.current = timeLeft;
  }, [timeLeft]);

  // Play start sound when timer starts or round changes
  useEffect(() => {
    if (isRunning && !isRestPeriod) {
      // Play start sound for fight rounds (not rest periods)
      playSound('start');
    }
  }, [isRunning, currentRound, isRestPeriod, playSound]);

  // Handle timer completion
  useEffect(() => {
    if (hasCompleted) {
      onComplete();
      setHasCompleted(false);
    }
  }, [hasCompleted, onComplete]);

  // Timer countdown logic
  useEffect(() => {
    // Clear any existing interval first
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }

    // Start new interval if running and time > 0
    if (isRunning && timeLeftRef.current > 0) {
      intervalRef.current = setInterval(() => {
        setTimeLeft((prev) => {
          const newTime = prev - 1;
          
          // Mark as completed when timer reaches 0
          if (newTime === 0 && !hasPlayedBellRef.current) {
            playSound('bell');
            setHasCompleted(true);
            hasPlayedBellRef.current = true;
          }
          
          return newTime;
        });
      }, 1000);
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isRunning, timeLeft]);

  // Format time as MM:SS
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Get progress percentage
  const getProgress = () => {
    const totalTime = isRestPeriod ? restTime : roundTime;
    return ((totalTime - timeLeft) / totalTime) * 100;
  };

  return (
    <div className="text-center">
      {/* Round Display */}
      <div className="mb-6">
        <div className="text-2xl font-semibold text-red-200 mb-2">
          {isRestPeriod ? 'Rest Period' : `Round ${currentRound}`}
        </div>
        <div className="text-lg text-red-300">
          {currentRound} of {totalRounds} rounds
        </div>
      </div>

      {/* Timer Display */}
      <div className="relative mb-8">
        <div className="text-8xl md:text-9xl font-bold font-mono transition-all duration-300 text-white">
          {formatTime(timeLeft)}
        </div>
        
        {/* Progress Bar */}
        <div className="w-full bg-gray-700 rounded-full h-3 mt-4">
          <div 
            className={`h-3 rounded-full transition-all duration-1000 ${
              isRestPeriod ? 'bg-blue-500' : 'bg-red-500'
            }`}
            style={{ width: `${getProgress()}%` }}
          ></div>
        </div>
      </div>

      {/* Status */}
      <div className="text-xl font-semibold">
        {isRestPeriod ? '🛌 Rest Time' : '🥊 Fight Time'}
      </div>
    </div>
  );
}
