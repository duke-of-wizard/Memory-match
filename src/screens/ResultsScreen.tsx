import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import confetti from 'canvas-confetti';
import { useGame } from '../context/GameContext';
import { ScreenWrapper } from '../components/shared/ScreenWrapper';
import { Button } from '../components/shared/Button';

function AnimatedScore({ target, delay }: { target: number; delay: number }) {
  const [value, setValue] = useState(0);
  useEffect(() => {
    const timer = setTimeout(() => {
      let current = 0;
      const step = Math.max(1, Math.ceil(target / 20));
      const interval = setInterval(() => {
        current += step;
        if (current >= target) { setValue(target); clearInterval(interval); }
        else setValue(current);
      }, 40);
      return () => clearInterval(interval);
    }, delay);
    return () => clearTimeout(timer);
  }, [target, delay]);
  return <>{value}</>;
}

export function ResultsScreen() {
  const { state, dispatch } = useGame();

  useEffect(() => {
    if (state.winner === 'player') {
      const end = Date.now() + 3000;
      const frame = () => {
        confetti({ particleCount: 3, angle: 60, spread: 55, origin: { x: 0, y: 0.6 }, colors: ['#15C39A', '#6B4EFF', '#F59E0B'] });
        confetti({ particleCount: 3, angle: 120, spread: 55, origin: { x: 1, y: 0.6 }, colors: ['#15C39A', '#6B4EFF', '#F59E0B'] });
        if (Date.now() < end) requestAnimationFrame(frame);
      };
      frame();
    }
  }, [state.winner]);

  return (
    <ScreenWrapper>
      <div className="text-center">
        {/* Trophy */}
        <motion.div
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ type: 'spring', stiffness: 180, damping: 14 }}
          className="text-7xl mb-6 inline-block"
        >
          {state.winner === 'player' ? '\u{1F3C6}' : state.winner === 'computer' ? '\u{1F916}' : '\u{1F91D}'}
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
          <h1 className="text-2xl font-bold text-text-primary mb-1">
            {state.winner === 'player' ? 'You Win!' : state.winner === 'computer' ? 'Computer Wins!' : "It's a Draw!"}
          </h1>
          <p className="text-sm text-text-secondary mb-8">
            {state.winner === 'player' ? 'Incredible memory!' : state.winner === 'computer' ? 'Better luck next time!' : 'Evenly matched!'}
          </p>
        </motion.div>

        {/* Score Cards */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}
          className="flex gap-4 justify-center mb-8"
        >
          <div className={`relative bg-surface-alt rounded-2xl p-5 flex-1 max-w-[180px] border ${state.winner === 'player' ? 'border-primary/30' : 'border-border-light'}`}>
            {state.winner === 'player' && <div className="absolute -top-2.5 left-1/2 -translate-x-1/2 text-sm">{'\u{1F451}'}</div>}
            <span className="text-2xl block mb-1">{state.selectedPlayer?.emoji || '\u{1F464}'}</span>
            <p className="text-xs font-semibold text-text-secondary">{state.selectedPlayer?.name || 'You'}</p>
            <p className="text-3xl font-extrabold text-primary mt-1"><AnimatedScore target={state.playerScore} delay={600} /></p>
            <p className="text-[10px] text-text-muted mt-0.5">pairs</p>
          </div>

          <div className={`relative bg-surface-alt rounded-2xl p-5 flex-1 max-w-[180px] border ${state.winner === 'computer' ? 'border-accent/30' : 'border-border-light'}`}>
            {state.winner === 'computer' && <div className="absolute -top-2.5 left-1/2 -translate-x-1/2 text-sm">{'\u{1F451}'}</div>}
            <span className="text-2xl block mb-1">{'\u{1F916}'}</span>
            <p className="text-xs font-semibold text-text-secondary">Computer</p>
            <p className="text-3xl font-extrabold text-accent mt-1"><AnimatedScore target={state.computerScore} delay={800} /></p>
            <p className="text-[10px] text-text-muted mt-0.5">pairs</p>
          </div>
        </motion.div>

        {/* Stats */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.7 }}
          className="flex justify-center gap-6 text-center mb-10 py-3 border-t border-b border-border-light"
        >
          <div>
            <p className="text-base font-bold text-text-primary">{state.playerScore + state.computerScore}</p>
            <p className="text-[10px] text-text-muted uppercase tracking-wide">Total</p>
          </div>
          <div>
            <p className="text-base font-bold text-text-primary capitalize">{state.difficulty}</p>
            <p className="text-[10px] text-text-muted uppercase tracking-wide">Level</p>
          </div>
          <div>
            <p className="text-base">{state.selectedCategory?.icon}</p>
            <p className="text-[10px] text-text-muted uppercase tracking-wide">{state.selectedCategory?.name}</p>
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.9 }}>
          <Button onClick={() => dispatch({ type: 'RESET_GAME' })} size="lg" className="min-w-[200px]">
            {"Play Again"}
          </Button>
        </motion.div>
      </div>
    </ScreenWrapper>
  );
}
