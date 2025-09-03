'use client';

import { useState, useEffect, useRef, useCallback } from 'react';

interface TimerProps {
  isRunning: boolean;
  isRestPeriod: boolean;         // true while timing REST, false while timing FIGHT
  roundTime: number;
  restTime: number;
  currentRound: number;
  totalRounds: number;
  onComplete: () => void;        // parent flips rest<->fight / advances round
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

  const [timeLeft, setTimeLeft] = useState<number>(getPeriodSeconds());

  // timing refs
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const endAtRef = useRef<number | null>(null);
  const remainingRef = useRef<number>(getPeriodSeconds());
  const hasRungRef = useRef<boolean>(false);
  const prevIsRunningRef = useRef<boolean>(false);

  // transition tracking to trigger "start" once per fight round
  const prevIsRestPeriodRef = useRef<boolean>(isRestPeriod);
  const currentRoundRef = useRef<number>(currentRound);
  const lastStartKeyRef = useRef<string>('');

  // audio
  const bellAudioRef = useRef<HTMLAudioElement | null>(null);
  const startAudioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    const makeAudio = (src: string) => {
      const a = new Audio(src);
      a.preload = 'auto';
      return a;
    };
    bellAudioRef.current = makeAudio(customSounds['bell'] || '/sounds/bell.mp3');
    startAudioRef.current = makeAudio(customSounds['start'] || '/sounds/start.mp3');
  }, [customSounds]);

  const play = (el: HTMLAudioElement | null) => {
    if (!el) return;
    try { el.currentTime = 0; } catch {}
    el.play().catch(() => {/* ignore autoplay errors */});
  };

  const playBell = useCallback(() => play(bellAudioRef.current), []);
  const playStart = useCallback(() => play(startAudioRef.current), []);

  // interval helpers
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

        // 🔔 Only ring the bell when a FIGHT period ends.
        // If a REST period ends, DO NOT play bell.
        if (!isRestPeriod) {
          playBell();
        }

        // let parent flip to next period/round
        queueMicrotask(() => onComplete());
        clearTick();
      }
    }, 250);
  }, [clearTick, onComplete, playBell, isRestPeriod]);

  // respond to (period/duration/round) changes
  useEffect(() => {
    const newTotal = getPeriodSeconds();

    if (!isRunning) {
      hasRungRef.current = false;
      remainingRef.current = newTotal;
      setTimeLeft(newTotal);
      endAtRef.current = null;
      clearTick();
      return;
    }

    // running → start a fresh leg
    hasRungRef.current = false;
    remainingRef.current = newTotal;
    endAtRef.current = Date.now() + newTotal * 1000;
    setTimeLeft(newTotal);
    startTick();
  }, [
    isRestPeriod,
    roundTime,
    restTime,
    isRunning,
    currentRound,
    getPeriodSeconds,
    startTick,
    clearTick
  ]);

  // start/pause toggles
  useEffect(() => {
    const wasRunning = prevIsRunningRef.current;
    prevIsRunningRef.current = isRunning;

    // starting
    if (!wasRunning && isRunning) {
      hasRungRef.current = false;

      // If starting directly into a FIGHT, play start now
      if (!isRestPeriod) {
        playStart();
        lastStartKeyRef.current = `fight-${currentRound}`;
      }

      const seconds = remainingRef.current ?? getPeriodSeconds();
      endAtRef.current = Date.now() + seconds * 1000;
      startTick();
    }

    // pausing
    if (wasRunning && !isRunning) {
      clearTick();
      if (endAtRef.current != null) {
        const msLeft = Math.max(0, endAtRef.current - Date.now());
        remainingRef.current = Math.max(0, Math.ceil(msLeft / 1000));
        setTimeLeft(remainingRef.current);
      }
      endAtRef.current = null;
    }
  }, [isRunning, isRestPeriod, currentRound, getPeriodSeconds, startTick, clearTick, playStart]);

  // ▶️ play "start" when entering a fight period while already running
  useEffect(() => {
    if (!isRunning) {
      prevIsRestPeriodRef.current = isRestPeriod;
      currentRoundRef.current = currentRound;
      return;
    }

    const prevWasRest = prevIsRestPeriodRef.current;
    const roundChanged = currentRoundRef.current !== currentRound;
    const key = `fight-${currentRound}`;

    if (!isRestPeriod && (prevWasRest || roundChanged) && lastStartKeyRef.current !== key) {
      playStart();
      lastStartKeyRef.current = key;
    }

    prevIsRestPeriodRef.current = isRestPeriod;
    currentRoundRef.current = currentRound;
  }, [isRunning, isRestPeriod, currentRound, playStart]);

  // cleanup
  useEffect(() => clearTick(), [clearTick]);

  // helpers
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
        <div
          className="w-full bg-gray-700 rounded-full h-3 mt-4"
          role="progressbar"
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={Math.round(getProgress())}
        >
          <div
            className={`h-3 rounded-full transition-all duration-300 ${
              isRestPeriod ? 'bg-blue-500' : 'bg-red-500'
            }`}
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
