'use client';

import { useState, useRef } from 'react';

interface SoundManagerProps {
  customSounds: { [key: string]: string };
  addCustomSound: (name: string, audioUrl: string) => void;
  removeCustomSound: (name: string) => void;
}

export function SoundManager({
  customSounds,
  addCustomSound,
  removeCustomSound
}: SoundManagerProps) {
  const [newSoundName, setNewSoundName] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('audio/')) {
      alert('Please select an audio file (MP3, WAV, OGG, etc.)');
      return;
    }

    // Validate file size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      alert('File size must be less than 10MB');
      return;
    }

    setIsUploading(true);

    const reader = new FileReader();
    reader.onload = (e) => {
      const audioUrl = e.target?.result as string;
      const soundName = newSoundName.trim() || file.name.replace(/\.[^/.]+$/, '');
      
      addCustomSound(soundName, audioUrl);
      setNewSoundName('');
      setIsUploading(false);
      
      // Reset file input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    };
    reader.readAsDataURL(file);
  };

  const handleRemoveSound = (name: string) => {
    if (confirm(`Are you sure you want to remove "${name}"?`)) {
      removeCustomSound(name);
    }
  };

  const playSound = (audioUrl: string) => {
    const audio = new Audio(audioUrl);
    audio.play().catch(console.error);
  };

  return (
    <div className="bg-black/30 backdrop-blur-sm rounded-2xl p-6 border border-red-500/20">
      <h3 className="text-2xl font-bold mb-4 text-center">🎵 Custom Sounds</h3>
      
      {/* Upload Section */}
      <div className="mb-6">
        <div className="mb-4">
          <label className="block text-sm font-medium text-red-200 mb-2">
            Sound Name (optional)
          </label>
          <input
            type="text"
            value={newSoundName}
            onChange={(e) => setNewSoundName(e.target.value)}
            placeholder="e.g., bell, start, buzzer"
            className="w-full px-3 py-2 bg-black/50 border border-red-500/30 rounded-lg text-white placeholder-red-300 focus:outline-none focus:border-red-500"
          />
        </div>
        
        <div className="mb-4">
          <label className="block text-sm font-medium text-red-200 mb-2">
            Upload Audio File
          </label>
          <input
            ref={fileInputRef}
            type="file"
            accept="audio/*"
            onChange={handleFileUpload}
            disabled={isUploading}
            className="w-full px-3 py-2 bg-black/50 border border-red-500/30 rounded-lg text-white file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-red-600 file:text-white hover:file:bg-red-700 disabled:opacity-50"
          />
        </div>
        
        {isUploading && (
          <div className="text-center text-yellow-400">
            Uploading sound...
          </div>
        )}
      </div>

      {/* Sound List */}
      <div>
        <h4 className="text-lg font-semibold mb-3 text-red-200">Your Sounds</h4>
        
        {Object.keys(customSounds).length === 0 ? (
          <div className="text-center text-red-300 py-4">
            No custom sounds uploaded yet
          </div>
        ) : (
          <div className="space-y-3">
            {Object.entries(customSounds).map(([name, audioUrl]) => (
              <div
                key={name}
                className="flex items-center justify-between p-3 bg-black/20 rounded-lg border border-red-500/20"
              >
                <div className="flex items-center space-x-3">
                  <button
                    onClick={() => playSound(audioUrl)}
                    className="text-green-400 hover:text-green-300 text-lg"
                    title="Play sound"
                  >
                    ▶️
                  </button>
                  <span className="text-white font-medium">{name}</span>
                </div>
                
                <button
                  onClick={() => handleRemoveSound(name)}
                  className="text-red-400 hover:text-red-300 text-lg"
                  title="Remove sound"
                >
                  🗑️
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Instructions */}
      <div className="mt-6 p-4 bg-black/20 rounded-lg">
        <h5 className="font-semibold text-red-200 mb-2">How to use custom sounds:</h5>
        <ul className="text-sm text-red-300 space-y-1">
          <li>• Upload audio files (MP3, WAV, OGG)</li>
          <li>• Name them &quot;start&quot; for round start sounds</li>
          <li>• Name them &quot;bell&quot; for round end sounds</li>
          <li>• Max file size: 10MB</li>
          <li>• Check browser console for sound triggers</li>
        </ul>
      </div>
    </div>
  );
}
