interface ScoreboardProps {
  playerName: string;
  playerEmoji: string;
  playerScore: number;
  computerScore: number;
  currentTurn: 'player' | 'computer';
  timeRemaining: number;
  matchedPairs: number;
  totalPairs: number;
}

function TimerRing({ time, max }: { time: number; max: number }) {
  const radius = 22;
  const circumference = 2 * Math.PI * radius;
  const progress = time / max;
  const offset = circumference * (1 - progress);
  const color = time <= 5 ? '#EF4444' : time <= 10 ? '#F59E0B' : '#15C39A';

  return (
    <div className="relative flex items-center justify-center">
      <svg width="52" height="52" className="timer-ring">
        <circle className="timer-ring-track" cx="26" cy="26" r={radius} strokeWidth="3" />
        <circle className="timer-ring-fill" cx="26" cy="26" r={radius} strokeWidth="3"
          stroke={color} strokeDasharray={circumference} strokeDashoffset={offset} />
      </svg>
      <div className="absolute flex flex-col items-center">
        <span className={`text-sm font-extrabold tabular-nums leading-none ${time <= 5 ? 'text-danger' : time <= 10 ? 'text-warning' : 'text-primary-dark'}`}>
          {time}
        </span>
        <span className="text-[6px] uppercase tracking-widest text-text-muted font-bold mt-px">sec</span>
      </div>
    </div>
  );
}

export function Scoreboard({
  playerName, playerEmoji, playerScore, computerScore,
  currentTurn, timeRemaining, matchedPairs, totalPairs,
}: ScoreboardProps) {
  const isPlayerTurn = currentTurn === 'player';
  const pct = totalPairs > 0 ? Math.round((matchedPairs / totalPairs) * 100) : 0;

  return (
    <div className="mb-4">
      <div className="flex items-center justify-between gap-3 mb-3">
        {/* Player */}
        <div className={`flex items-center gap-2.5 px-3 py-2 rounded-xl transition-all duration-200 ${isPlayerTurn ? 'bg-primary-light border border-primary/25' : 'bg-surface-alt border border-border-light'}`}>
          <span className="text-lg">{playerEmoji}</span>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-xs font-semibold text-text-primary">{playerName}</span>
              {isPlayerTurn && <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />}
            </div>
            <span className="text-lg font-extrabold text-primary leading-none">{playerScore}</span>
          </div>
        </div>

        <TimerRing time={timeRemaining} max={20} />

        {/* Computer */}
        <div className={`flex items-center gap-2.5 px-3 py-2 rounded-xl transition-all duration-200 ${!isPlayerTurn ? 'bg-accent-light border border-accent/20' : 'bg-surface-alt border border-border-light'}`}>
          <div className="text-right">
            <div className="flex items-center justify-end gap-1.5">
              {!isPlayerTurn && <span className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse" />}
              <span className="text-xs font-semibold text-text-primary">Computer</span>
            </div>
            <span className="text-lg font-extrabold text-accent leading-none">{computerScore}</span>
          </div>
          <span className="text-lg">{'\u{1F916}'}</span>
        </div>
      </div>

      {/* Progress */}
      <div className="flex items-center gap-3">
        <div className="flex-1 h-1.5 bg-surface-alt rounded-full overflow-hidden">
          <div className="h-full bg-primary rounded-full transition-all duration-500" style={{ width: `${pct}%` }} />
        </div>
        <span className="text-[10px] font-semibold text-text-muted whitespace-nowrap">{matchedPairs}/{totalPairs} pairs</span>
      </div>
    </div>
  );
}
