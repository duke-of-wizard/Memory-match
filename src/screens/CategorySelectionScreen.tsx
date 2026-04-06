import { useState } from 'react';
import { motion } from 'framer-motion';
import { useGame } from '../context/GameContext';
import { categories } from '../data/categories';
import { generateBoard } from '../utils/boardGenerator';
import { ScreenWrapper } from '../components/shared/ScreenWrapper';
import { Button } from '../components/shared/Button';

import type { Category } from '../types/game';

const catColors: Record<string, { bg: string; selected: string; border: string }> = {
  fruits: { bg: 'bg-emerald-50', selected: 'bg-emerald-50 border-emerald-400', border: 'border-emerald-200' },
  airlines: { bg: 'bg-sky-50', selected: 'bg-sky-50 border-sky-400', border: 'border-sky-200' },
  animals: { bg: 'bg-amber-50', selected: 'bg-amber-50 border-amber-400', border: 'border-amber-200' },
  sports: { bg: 'bg-rose-50', selected: 'bg-rose-50 border-rose-400', border: 'border-rose-200' },
};

export function CategorySelectionScreen() {
  const { state, dispatch } = useGame();
  const [selected, setSelected] = useState<Category | null>(null);

  const handlePlay = () => {
    if (!selected) return;
    const board = generateBoard(state.difficulty, selected);
    dispatch({ type: 'SELECT_CATEGORY', payload: { category: selected, board } });
  };

  return (
    <ScreenWrapper>
      {/* Header */}
      <div className="text-center mb-6">
        <h1 className="text-2xl font-bold text-text-primary mb-1">
          Choose a Category
        </h1>
        <p className="text-sm text-text-secondary">What would you like to match?</p>
      </div>

      {/* Category Grid */}
      <div className="grid grid-cols-2 gap-4 mb-10">
        {categories.map((cat) => {
          const isSelected = selected?.id === cat.id;
          const colors = catColors[cat.id] || catColors.fruits;

          return (
            <motion.button
              key={cat.id}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => setSelected(cat)}
              className={`relative flex flex-col items-center py-8 px-4 rounded-2xl cursor-pointer transition-all duration-150 ${isSelected ? `${colors.selected} border-2 shadow-md` : `${colors.bg} border border-border-light hover:border-border hover:shadow-sm`}`}
            >
              {isSelected && (
                <div className="absolute top-3 right-3 w-5 h-5 rounded-full bg-primary flex items-center justify-center">
                  <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                </div>
              )}
              <span className="text-4xl mb-3">{cat.icon}</span>
              <span className="text-sm font-bold text-text-primary">{cat.name}</span>
              <span className="text-[11px] text-text-muted mt-0.5">{cat.description}</span>
            </motion.button>
          );
        })}
      </div>

      {/* Buttons */}
      <div className="flex justify-center gap-3">
        <Button variant="ghost" onClick={() => dispatch({ type: 'SET_SCREEN', payload: 'player' })}>
          {"\u2190 Back"}
        </Button>
        <Button onClick={handlePlay} disabled={!selected} size="lg" className="min-w-[200px]">
          {"Start Game"}
        </Button>
      </div>
    </ScreenWrapper>
  );
}
