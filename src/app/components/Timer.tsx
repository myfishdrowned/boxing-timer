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
}

export function Timer({
  isRunning,
  isRestPeriod,
  roundTime,
  restTime,
  currentRound,
  totalRounds,
  onComplete,
}: TimerProps) {
  const getPeriodSeconds = useCallback(
    () => (isRestPeriod ? restTime : roundTime),
    [isRestPeriod, restTime, roundTime]
  );

  const [timeLeft, setTimeLeft] = useState<number>(getPeriodSeconds());

  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const endAtRef = useRef<number | null>(null);
  const remainingRef = useRef<number>(getPeriodSeconds());
  const hasRungRef = useRef<boolean>(false);
  const prevIsRunningRef = useRef<boolean>(false);

  const prevIsRestPeriodRef = useRef<boolean>(isRestPeriod);
  const currentRoundRef = useRef<number>(currentRound);
  const lastStartKeyRef = useRef<string>('');

  const audioCtxRef = useRef<AudioContext | null>(null);
  const bellBufferRef = useRef<AudioBuffer | null>(null);
  const startBufferRef = useRef<AudioBuffer | null>(null);

  useEffect(() => {
    const AudioCtx = window.AudioContext ?? (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    const ctx = new AudioCtx();
    audioCtxRef.current = ctx;

    const load = (src: string) =>
      fetch(src).then(r => r.arrayBuffer()).then(buf => ctx.decodeAudioData(buf));

    load('/sounds/bell.mp3').then(b => { bellBufferRef.current = b; }).catch(() => {});
    load('/sounds/start.mp3').then(b => { startBufferRef.current = b; }).catch(() => {});

    return () => { ctx.close(); };
  }, []);

  const playBuffer = useCallback((buffer: AudioBuffer | null) => {
    const ctx = audioCtxRef.current;
    if (!ctx || !buffer) return;
    ctx.resume().then(() => {
      const source = ctx.createBufferSource();
      source.buffer = buffer;
      source.connect(ctx.destination);
      source.start(0);
    }).catch(() => {});
  }, []);

  const playBell = useCallback(() => playBuffer(bellBufferRef.current), [playBuffer]);
  const playStart = useCallback(() => playBuffer(startBufferRef.current), [playBuffer]);

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
        if (!isRestPeriod) {
          playBell();
        }
        queueMicrotask(() => onComplete());
        clearTick();
      }
    }, 250);
  }, [clearTick, onComplete, playBell, isRestPeriod]);

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

    hasRungRef.current = false;
    remainingRef.current = newTotal;
    endAtRef.current = Date.now() + newTotal * 1000;
    setTimeLeft(newTotal);
    startTick();
  }, [isRestPeriod, roundTime, restTime, isRunning, currentRound, getPeriodSeconds, startTick, clearTick]);

  useEffect(() => {
    const wasRunning = prevIsRunningRef.current;
    prevIsRunningRef.current = isRunning;

    if (!wasRunning && isRunning) {
      hasRungRef.current = false;
      if (!isRestPeriod) {
        playStart();
        lastStartKeyRef.current = `fight-${currentRound}`;
      }
      const seconds = remainingRef.current ?? getPeriodSeconds();
      endAtRef.current = Date.now() + seconds * 1000;
      startTick();
    }

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

  useEffect(() => clearTick(), [clearTick]);

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
      <div className="mb-6">
        <div className="text-2xl font-semibold text-red-200 mb-2">
          {isRestPeriod ? 'Rest Period' : `Round ${currentRound}`}
        </div>
        <div className="text-lg text-red-300">
          {currentRound} of {totalRounds} rounds
        </div>
      </div>

      <div className="relative mb-8">
        <div className="text-8xl md:text-9xl font-bold font-mono transition-all duration-300 text-white">
          {formatTime(timeLeft)}
        </div>

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

      <div className="text-xl font-semibold">
        {isRestPeriod ? '🛌 Rest Time' : '🥊 Fight Time'}
      </div>
    </div>
  );
}
