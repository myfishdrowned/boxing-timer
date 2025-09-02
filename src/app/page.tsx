'use client';

import { useState, useEffect } from 'react';
import { Timer } from './components/Timer';
import { SoundManager } from './components/SoundManager';
import { RoundSettings } from './components/RoundSettings';
import { SoundTest } from './components/SoundTest';

export default function Home() {
  const [isRunning, setIsRunning] = useState(false);
  const [currentRound, setCurrentRound] = useState(1);
  const [totalRounds, setTotalRounds] = useState(12);
  const [roundTime, setRoundTime] = useState(180); // 3 minutes in seconds
  const [restTime, setRestTime] = useState(60); // 1 minute in seconds
  const [isRestPeriod, setIsRestPeriod] = useState(false);
  const [customSounds, setCustomSounds] = useState<{ [key: string]: string }>({});

  const [pendingAction, setPendingAction] = useState<'next-round' | 'rest-period' | 'complete' | null>(null);

  const handleTimerComplete = () => {
    if (isRestPeriod) {
      // Rest period ended, start next round
      if (currentRound + 1 > totalRounds) {
        // All rounds completed
        setPendingAction('complete');
      } else {
        // Start next round
        setPendingAction('next-round');
      }
    } else {
      // Round ended, start rest period
      if (currentRound < totalRounds) {
        // More rounds to go
        setPendingAction('rest-period');
      } else {
        // Last round completed
        setPendingAction('complete');
      }
    }
  };

  // Handle pending actions with useEffect to avoid state updates during render
  useEffect(() => {
    if (pendingAction === 'next-round') {
      setIsRestPeriod(false);
      setCurrentRound(prev => prev + 1);
      setIsRunning(true);
      setPendingAction(null);
    } else if (pendingAction === 'rest-period') {
      setIsRestPeriod(true);
      setIsRunning(true);
      setPendingAction(null);
    } else if (pendingAction === 'complete') {
      setIsRunning(false);
      setCurrentRound(1);
      setIsRestPeriod(false);
      setPendingAction(null);
    }
  }, [pendingAction]);

  const startTimer = () => {
    setIsRunning(true);
    setCurrentRound(1);
    setIsRestPeriod(false);
  };

  const stopTimer = () => {
    setIsRunning(false);
  };

  const resetTimer = () => {
    setIsRunning(false);
    setCurrentRound(1);
    setIsRestPeriod(false);
  };

  const addCustomSound = (name: string, audioUrl: string) => {
    setCustomSounds(prev => ({
      ...prev,
      [name]: audioUrl
    }));
  };

  const removeCustomSound = (name: string) => {
    setCustomSounds(prev => {
      const newSounds = { ...prev };
      delete newSounds[name];
      return newSounds;
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-900 via-red-800 to-red-900 text-white">
      <div className="container mx-auto px-4 py-8">
        <header className="text-center mb-8">
          <h1 className="text-4xl md:text-6xl font-bold mb-2">🥊 Boxing Timer</h1>
          <p className="text-xl text-red-200">Professional boxing timer with custom sounds</p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Timer Display */}
          <div className="lg:col-span-2">
            <div className="bg-black/30 backdrop-blur-sm rounded-2xl p-8 border border-red-500/20">
              <Timer
                isRunning={isRunning}
                isRestPeriod={isRestPeriod}
                roundTime={roundTime}
                restTime={restTime}
                currentRound={currentRound}
                totalRounds={totalRounds}
                onComplete={handleTimerComplete}
                customSounds={customSounds}
              />
              
              <div className="flex justify-center gap-4 mt-8">
                {!isRunning ? (
                  <button
                    onClick={startTimer}
                    className="bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-8 rounded-lg transition-colors duration-200"
                  >
                    Start Fight
                  </button>
                ) : (
                  <>
                    <button
                      onClick={stopTimer}
                      className="bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-8 rounded-lg transition-colors duration-200"
                    >
                      Stop
                    </button>
                    <button
                      onClick={resetTimer}
                      className="bg-gray-600 hover:bg-gray-700 text-white font-bold py-3 px-8 rounded-lg transition-colors duration-200"
                    >
                      Reset
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Settings Panel */}
          <div className="space-y-6">
            <RoundSettings
              totalRounds={totalRounds}
              setTotalRounds={setTotalRounds}
              roundTime={roundTime}
              setRoundTime={setRoundTime}
              restTime={restTime}
              setRestTime={setRestTime}
            />
            
            <SoundManager
              customSounds={customSounds}
              addCustomSound={addCustomSound}
              removeCustomSound={removeCustomSound}
            />
            
            <SoundTest />
          </div>
        </div>
      </div>
    </div>
  );
}
