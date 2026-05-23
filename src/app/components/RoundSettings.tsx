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

const roundTimeOptions = Array.from({ length: 60 }, (_, i) => (i + 1) * 30); // 0:30 to 30:00
const restTimeOptions = Array.from({ length: 20 }, (_, i) => (i + 1) * 30);  // 0:30 to 10:00

const selectClass = "w-full px-3 py-3 bg-black/50 border border-red-500/30 rounded-lg text-white text-base focus:outline-none focus:border-red-500";

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
    { name: 'Ultra Quick', rounds: 3, roundTime: 60, restTime: 30 },
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

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-red-200 mb-2">Number of Rounds</label>
          <select
            value={totalRounds}
            onChange={(e) => setTotalRounds(Number(e.target.value))}
            className={selectClass}
          >
            {[1, 2, 3, 4, 5, 6, 8, 10, 12, 15, 20].map((r) => (
              <option key={r} value={r}>{r} {r === 1 ? 'Round' : 'Rounds'}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-red-200 mb-2">Round Duration</label>
          <select
            value={roundTime}
            onChange={(e) => setRoundTime(Number(e.target.value))}
            className={selectClass}
          >
            {roundTimeOptions.map((s) => (
              <option key={s} value={s}>{formatTime(s)}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-red-200 mb-2">Rest Duration</label>
          <select
            value={restTime}
            onChange={(e) => setRestTime(Number(e.target.value))}
            className={selectClass}
          >
            {restTimeOptions.map((s) => (
              <option key={s} value={s}>{formatTime(s)}</option>
            ))}
          </select>
        </div>
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
