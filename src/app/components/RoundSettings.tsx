'use client';

interface RoundSettingsProps {
  totalRounds: number;
  setTotalRounds: (rounds: number) => void;
  roundTime: number;
  setRoundTime: (time: number) => void;
  restTime: number;
  setRestTime: (time: number) => void;
}

export function RoundSettings({
  totalRounds,
  setTotalRounds,
  roundTime,
  setRoundTime,
  restTime,
  setRestTime
}: RoundSettingsProps) {
  const formatTimeInput = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const parseTimeInput = (timeString: string) => {
    const [mins, secs] = timeString.split(':').map(Number);
    return (mins || 0) * 60 + (secs || 0);
  };

  const handleRoundTimeChange = (value: string) => {
    const time = parseTimeInput(value);
    if (time >= 5 && time <= 1800) { // Min 5 seconds, max 30 minutes
      setRoundTime(time);
    }
  };

  const handleRestTimeChange = (value: string) => {
    const time = parseTimeInput(value);
    if (time >= 5 && time <= 600) { // Min 5 seconds, max 10 minutes
      setRestTime(time);
    }
  };

  const presetConfigs = [
    { name: 'Amateur', rounds: 3, roundTime: 120, restTime: 60 },
    { name: 'Professional', rounds: 12, roundTime: 180, restTime: 60 },
    { name: 'Title Fight', rounds: 12, roundTime: 180, restTime: 60 },
    { name: 'Quick Workout', rounds: 6, roundTime: 120, restTime: 30 },
    { name: 'Ultra Quick', rounds: 3, roundTime: 10, restTime: 5 },
  ];

  return (
    <div className="bg-black/30 backdrop-blur-sm rounded-2xl p-6 border border-red-500/20">
      <h3 className="text-2xl font-bold mb-4 text-center">⚙️ Round Settings</h3>
      
      {/* Preset Configurations */}
      <div className="mb-6">
        <h4 className="text-lg font-semibold mb-3 text-red-200">Quick Presets</h4>
        <div className="grid grid-cols-2 gap-2">
          {presetConfigs.map((preset) => (
            <button
              key={preset.name}
              onClick={() => {
                setTotalRounds(preset.rounds);
                setRoundTime(preset.roundTime);
                setRestTime(preset.restTime);
              }}
              className="px-3 py-2 bg-red-600 hover:bg-red-700 text-white text-sm font-medium rounded-lg transition-colors duration-200"
            >
              {preset.name}
            </button>
          ))}
        </div>
      </div>

      {/* Custom Settings */}
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-red-200 mb-2">
            Number of Rounds
          </label>
          <select
            value={totalRounds}
            onChange={(e) => setTotalRounds(Number(e.target.value))}
            className="w-full px-3 py-2 bg-black/50 border border-red-500/30 rounded-lg text-white focus:outline-none focus:border-red-500"
          >
            {[1, 2, 3, 4, 5, 6, 8, 10, 12, 15].map((rounds) => (
              <option key={rounds} value={rounds}>
                {rounds} {rounds === 1 ? 'Round' : 'Rounds'}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-red-200 mb-2">
            Round Duration (MM:SS)
          </label>
          <input
            type="text"
            value={formatTimeInput(roundTime)}
            onChange={(e) => handleRoundTimeChange(e.target.value)}
            placeholder="3:00"
            className="w-full px-3 py-2 bg-black/50 border border-red-500/30 rounded-lg text-white placeholder-red-300 focus:outline-none focus:border-red-500"
          />
          <p className="text-xs text-red-300 mt-1">
            Format: MM:SS (min 0:05, max 30:00)
          </p>
        </div>

        <div>
          <label className="block text-sm font-medium text-red-200 mb-2">
            Rest Duration (MM:SS)
          </label>
          <input
            type="text"
            value={formatTimeInput(restTime)}
            onChange={(e) => handleRestTimeChange(e.target.value)}
            placeholder="1:00"
            className="w-full px-3 py-2 bg-black/50 border border-red-500/30 rounded-lg text-white placeholder-red-300 focus:outline-none focus:border-red-500"
          />
          <p className="text-xs text-red-300 mt-1">
            Format: MM:SS (min 0:05, max 10:00)
          </p>
        </div>
      </div>

      {/* Current Configuration Summary */}
      <div className="mt-6 p-4 bg-black/20 rounded-lg">
        <h5 className="font-semibold text-red-200 mb-2">Current Configuration:</h5>
        <div className="text-sm text-red-300 space-y-1">
          <div>• {totalRounds} rounds</div>
          <div>• {Math.floor(roundTime / 60)}:{String(roundTime % 60).padStart(2, '0')} per round</div>
          <div>• {Math.floor(restTime / 60)}:{String(restTime % 60).padStart(2, '0')} rest period</div>
          <div>• Total time: {Math.floor((roundTime * totalRounds + restTime * (totalRounds - 1)) / 60)}:{String((roundTime * totalRounds + restTime * (totalRounds - 1)) % 60).padStart(2, '0')}</div>
        </div>
      </div>
    </div>
  );
}


