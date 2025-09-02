'use client';

import { useState } from 'react';

export function SoundTest() {
  const [testResult, setTestResult] = useState<string>('');

  const testSound = (soundType: string) => {
    const audio = new Audio();
    audio.src = `/sounds/${soundType}.mp3`;
    
    audio.onloadstart = () => {
      setTestResult(`Loading ${soundType} sound...`);
    };
    
    audio.oncanplay = () => {
      setTestResult(`${soundType} sound loaded successfully!`);
    };
    
    audio.onerror = (error) => {
      setTestResult(`Error loading ${soundType} sound: ${error}`);
    };
    
    audio.play().then(() => {
      setTestResult(`${soundType} sound played successfully!`);
    }).catch((error) => {
      setTestResult(`Error playing ${soundType} sound: ${error.message}`);
    });
  };

  return (
    <div className="bg-black/30 backdrop-blur-sm rounded-2xl p-6 border border-red-500/20">
      <h3 className="text-2xl font-bold mb-4 text-center">🔊 Sound Test</h3>
      
      <div className="space-y-4">
        <button
          onClick={() => testSound('start')}
          className="w-full px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg"
        >
          Test Start Sound
        </button>
        
        <button
          onClick={() => testSound('bell')}
          className="w-full px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg"
        >
          Test Bell Sound
        </button>
        

      </div>
      
      {testResult && (
        <div className="mt-4 p-3 bg-black/20 rounded-lg">
          <p className="text-sm text-red-200">{testResult}</p>
        </div>
      )}
      
      <div className="mt-4 text-xs text-red-300">
        <p>Expected files:</p>
        <ul className="list-disc list-inside">
          <li>/public/sounds/start.mp3</li>
          <li>/public/sounds/bell.mp3</li>
        </ul>
      </div>
    </div>
  );
}

