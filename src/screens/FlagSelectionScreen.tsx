import { useState } from 'react';
import { motion } from 'framer-motion';
import { useGame } from '../context/GameContext';
import { countries } from '../data/countries';
import { ScreenWrapper } from '../components/shared/ScreenWrapper';
import { Button } from '../components/shared/Button';
import { DifficultySelector } from '../components/shared/DifficultySelector';

import type { Country, Difficulty } from '../types/game';

export function FlagSelectionScreen() {
  const { dispatch } = useGame();
  const [selected, setSelected] = useState<Country | null>(null);
  const [difficulty, setDifficulty] = useState<Difficulty>('medium');

  const handleNext = () => {
    if (!selected) return;
    dispatch({ type: 'SET_DIFFICULTY', payload: difficulty });
    dispatch({ type: 'SELECT_COUNTRY', payload: selected });
  };

  return (
    <ScreenWrapper>
      {/* Header */}
      <div className="text-center mb-12">
        <h1 className="text-3xl font-bold text-text-primary mb-2">
          Memory Match
        </h1>
        <p className="text-base text-text-secondary">Pick your country and difficulty to begin</p>
      </div>

      {/* Difficulty */}
      <div className="mb-12">
        <p className="text-xs font-semibold text-text-muted uppercase tracking-wider mb-4 text-center">Difficulty</p>
        <DifficultySelector selected={difficulty} onChange={setDifficulty} />
      </div>

      {/* Flag Grid */}
      <div className="mb-12">
        <div className="grid grid-cols-5 gap-3.5">
          {countries.map((country) => (
            <motion.button
              key={country.code}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.96 }}
              onClick={() => setSelected(country)}
              className={`flex flex-col items-center py-5 px-3 rounded-2xl cursor-pointer transition-all duration-150 ${selected?.code === country.code ? 'bg-primary-light border-2 border-primary shadow-md shadow-primary/10' : 'bg-surface-alt border border-border hover:border-text-muted hover:shadow-sm'}`}
            >
              <span className="text-5xl mb-2 leading-none">{country.flag}</span>
              <span className={`text-xs font-medium leading-tight text-center line-clamp-2 ${selected?.code === country.code ? 'text-primary-dark font-semibold' : 'text-text-secondary'}`}>
                {country.name}
              </span>
            </motion.button>
          ))}
        </div>
      </div>

      {/* Button */}
      <div className="flex justify-center">
        <Button onClick={handleNext} disabled={!selected} size="lg" className="min-w-[220px]">
          {"Continue \u2192"}
        </Button>
      </div>
    </ScreenWrapper>
  );
}
