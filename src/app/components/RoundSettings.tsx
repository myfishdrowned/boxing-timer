'use client';

interface RoundSettingsProps {
  totalRounds: number;
  setTotalRounds: (rounds: number) => void;
  roundTime: number;
  setRoundTime: (time: number) => void;
  restTime: number;
  setRestTime: (time: number) => void;
}

const formatTime = (seconds: number) => {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}:${secs.toString().padStart(2, '0')}`;
};

function Stepper({
  label,
  display,
  onDecrement,
  onIncrement,
}: {
  label: string;
  display: string;
  onDecrement: () => void;
  onIncrement: () => void;
}) {
  return (
    <div>
      <label className="block text-sm font-medium text-red-200 mb-2">{label}</label>
      <div className="flex items-center gap-3">
        <button
          onClick={onDecrement}
          className="w-12 h-12 flex items-center justify-center bg-red-700 hover:bg-red-600 active:bg-red-800 text-white text-2xl font-bold rounded-xl touch-manipulation select-none"
        >
          −
        </button>
        <span className="flex-1 text-center text-xl font-mono font-semibold text-white">
          {display}
        </span>
        <button
          onClick={onIncrement}
          className="w-12 h-12 flex items-center justify-center bg-red-700 hover:bg-red-600 active:bg-red-800 text-white text-2xl font-bold rounded-xl touch-manipulation select-none"
        >
          +
        </button>
      </div>
    </div>
  );
}

export function RoundSettings({
  totalRounds,
  setTotalRounds,
  roundTime,
  setRoundTime,
  restTime,
  setRestTime,
}: RoundSettingsProps) {
  const presetConfigs = [
    { name: 'Amateur', rounds: 3, roundTime: 180, restTime: 60 },
    { name: 'Professional', rounds: 12, roundTime: 180, restTime: 60 },
    { name: 'Title Fight', rounds: 12, roundTime: 180, restTime: 60 },
    { name: 'Quick Workout', rounds: 6, roundTime: 120, restTime: 30 },
    { name: 'Ultra Quick', rounds: 3, roundTime: 10, restTime: 5 },
  ];

  return (
    <div className="bg-black/30 backdrop-blur-sm rounded-2xl p-6 border border-red-500/20">
      <h3 className="text-2xl font-bold mb-4 text-center">⚙️ Round Settings</h3>

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
              className="px-3 py-3 bg-red-600 hover:bg-red-700 active:bg-red-800 text-white text-sm font-medium rounded-lg transition-colors duration-200 touch-manipulation"
            >
              {preset.name}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-5">
        <Stepper
          label="Number of Rounds"
          display={`${totalRounds} ${totalRounds === 1 ? 'Round' : 'Rounds'}`}
          onDecrement={() => setTotalRounds(Math.max(1, totalRounds - 1))}
          onIncrement={() => setTotalRounds(Math.min(20, totalRounds + 1))}
        />

        <Stepper
          label="Round Duration (30s steps)"
          display={formatTime(roundTime)}
          onDecrement={() => setRoundTime(Math.max(30, roundTime - 30))}
          onIncrement={() => setRoundTime(Math.min(1800, roundTime + 30))}
        />

        <Stepper
          label="Rest Duration (15s steps)"
          display={formatTime(restTime)}
          onDecrement={() => setRestTime(Math.max(15, restTime - 15))}
          onIncrement={() => setRestTime(Math.min(600, restTime + 15))}
        />
      </div>

      <div className="mt-6 p-4 bg-black/20 rounded-lg">
        <h5 className="font-semibold text-red-200 mb-2">Current Configuration:</h5>
        <div className="text-sm text-red-300 space-y-1">
          <div>• {totalRounds} rounds</div>
          <div>• {formatTime(roundTime)} per round</div>
          <div>• {formatTime(restTime)} rest period</div>
          <div>• Total: {formatTime(roundTime * totalRounds + restTime * (totalRounds - 1))}</div>
        </div>
      </div>
    </div>
  );
}
