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
  const getPeriodSeconds = useCallback(
    () => (isRestPeriod ? restTime : roundTime),
    [isRestPeriod, restTime, roundTime]
  );

  // Time left (in whole seconds)
  const [timeLeft, setTimeLeft] = useState<number>(getPeriodSeconds());

  // --- Refs for stable interval + timing math ---
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const endAtRef = useRef<number | null>(null); // epoch ms when this period ends
  const remainingRef = useRef<number>(getPeriodSeconds()); // seconds left when pausing
  const hasRungRef = useRef<boolean>(false);
  const prevIsRunningRef = useRef<boolean>(false);
  const prevIsRestPeriodRef = useRef<boolean>(isRestPeriod);

  // --- Audio: preload/reuse ---
  const bellAudioRef = useRef<HTMLAudioElement | null>(null);
  const startAudioRef = useRef<HTMLAudioElement | null>(null);

  // Preload audio on mount (and update if custom changes)
  useEffect(() => {
    const makeAudio = (src: string) => {
      const a = new Audio(src);
      a.preload = 'auto';
      return a;
    };

    bellAudioRef.current = makeAudio(customSounds['bell'] || '/sounds/bell.mp3');
    startAudioRef.current = makeAudio(customSounds['start'] || '/sounds/start.mp3');

    // No cleanup needed for HTMLAudioElement
  }, [customSounds]);

  const playSound = useCallback((type: 'bell' | 'start') => {
    const ref = type === 'bell' ? bellAudioRef.current : startAudioRef.current;
    if (!ref) return;

    // Reset to start in case it was played before
    try {
      ref.currentTime = 0;
    } catch {}
    ref.play().catch(() => {
      // Swallow autoplay errors quietly (user gesture constraints)
    });
  }, []);

  // --- Start/stop interval helpers ---
  const clearTick = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  const startTick = useCallback(() => {
    clearTick();
    intervalRef.current = setInterval(() => {
      if (endAtRef.current == null) return;

      const msLeft = endAtRef.current - Date.now();
      const secs = Math.max(0, Math.ceil(msLeft / 1000));
      setTimeLeft(secs);

      if (secs === 0 && !hasRungRef.current) {
        hasRungRef.current = true;
        playSound('bell');
        // Defer onComplete slightly to let sound fire without being cut by state churn
        queueMicrotask(() => onComplete());
        clearTick();
      }
    }, 250); // check 4x/sec for better accuracy without heavy cost
  }, [clearTick, onComplete, playSound]);

  // --- Respond to prop changes: new period or new durations ---
  // If period flips (fight <-> rest) or durations change, reset the countdown.
  useEffect(() => {
    const periodChanged = prevIsRestPeriodRef.current !== isRestPeriod;
    prevIsRestPeriodRef.current = isRestPeriod;

    const newTotal = getPeriodSeconds();

    // If timer is not running, just reset displayed time + remainingRef.
    if (!isRunning) {
      hasRungRef.current = false;
      remainingRef.current = newTotal;
      setTimeLeft(newTotal);
      endAtRef.current = null;
      clearTick();
      return;
    }

    // If running and the period changed or the duration changed, restart this segment.
    hasRungRef.current = false;
    remainingRef.current = newTotal;
    endAtRef.current = Date.now() + newTotal * 1000;
    setTimeLeft(newTotal);
    startTick();
  }, [isRestPeriod, roundTime, restTime, isRunning, getPeriodSeconds, startTick, clearTick]);

  // --- Start/stop based on isRunning toggles (pause/resume) ---
  useEffect(() => {
    const wasRunning = prevIsRunningRef.current;
    prevIsRunningRef.current = isRunning;

    // Started running
    if (!wasRunning && isRunning) {
      // Play start sound only for fight periods
      if (!isRestPeriod) playSound('start');

      hasRungRef.current = false;
      // If we already have a remaining count (e.g., resume), use it
      const seconds = remainingRef.current ?? getPeriodSeconds();
      endAtRef.current = Date.now() + seconds * 1000;
      startTick();
    }

    // Paused
    if (wasRunning && !isRunning) {
      clearTick();
      if (endAtRef.current != null) {
        const msLeft = Math.max(0, endAtRef.current - Date.now());
        remainingRef.current = Math.max(0, Math.ceil(msLeft / 1000));
        setTimeLeft(remainingRef.current);
      }
      endAtRef.current = null;
    }
  }, [isRunning, isRestPeriod, getPeriodSeconds, startTick, clearTick, playSound]);

  // Clear on unmount
  useEffect(() => clearTick(), [clearTick]);

  // Progress %
  const getProgress = () => {
    const total = getPeriodSeconds();
    if (total <= 0) return 100;
    return ((total - timeLeft) / total) * 100;
  };

  const formatTime = (s: number) => {
    const mins = Math.floor(s / 60);
    const secs = s % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="text-center" aria-live="polite">
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
        <div className="w-full bg-gray-700 rounded-full h-3 mt-4" role="progressbar" aria-valuemin={0} aria-valuemax={100} aria-valuenow={Math.round(getProgress())}>
          <div
            className={`h-3 rounded-full transition-all duration-300 ${isRestPeriod ? 'bg-blue-500' : 'bg-red-500'}`}
            style={{ width: `${getProgress()}%` }}
          />
        </div>
      </div>

      {/* Status */}
      <div className="text-xl font-semibold">
        {isRestPeriod ? '🛌 Rest Time' : '🥊 Fight Time'}
      </div>
    </div>
  );
}
