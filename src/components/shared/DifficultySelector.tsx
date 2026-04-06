import { motion } from 'framer-motion';
import type { Difficulty } from '../../types/game';

interface DifficultySelectorProps {
  selected: Difficulty;
  onChange: (d: Difficulty) => void;
}

const options: { value: Difficulty; label: string; desc: string; activeClass: string }[] = [
  { value: 'easy', label: 'Easy', desc: '30 cards', activeClass: 'bg-emerald-500 text-white ring-2 ring-emerald-200' },
  { value: 'medium', label: 'Medium', desc: '42 cards', activeClass: 'bg-amber-500 text-white ring-2 ring-amber-200' },
  { value: 'hard', label: 'Hard', desc: '64 cards', activeClass: 'bg-red-500 text-white ring-2 ring-red-200' },
];

export function DifficultySelector({ selected, onChange }: DifficultySelectorProps) {
  return (
    <div className="grid grid-cols-3 gap-3">
      {options.map(opt => {
        const isActive = selected === opt.value;
        return (
          <motion.button
            key={opt.value}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => onChange(opt.value)}
            className={`py-3.5 px-4 rounded-2xl text-center cursor-pointer transition-all duration-200 ${isActive ? `${opt.activeClass} shadow-lg` : 'bg-surface-alt text-text-secondary border border-border hover:border-text-muted'}`}
          >
            <span className="block text-sm font-bold">{opt.label}</span>
            <span className={`block text-xs mt-0.5 ${isActive ? 'text-white/70' : 'text-text-muted'}`}>{opt.desc}</span>
          </motion.button>
        );
      })}
    </div>
  );
}
