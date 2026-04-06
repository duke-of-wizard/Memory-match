import { useState } from 'react';
import { motion } from 'framer-motion';
import { useGame } from '../context/GameContext';
import { playersByCountry } from '../data/players';
import { ScreenWrapper } from '../components/shared/ScreenWrapper';
import { Button } from '../components/shared/Button';

import type { Player } from '../types/game';

const avatarColors = ['#15C39A', '#6B4EFF', '#F59E0B', '#EF4444', '#3B82F6'];

export function PlayerSelectionScreen() {
  const { state, dispatch } = useGame();
  const [selected, setSelected] = useState<Player | null>(null);

  const players = state.selectedCountry
    ? playersByCountry[state.selectedCountry.code] || []
    : [];

  const handleNext = () => {
    if (!selected) return;
    dispatch({ type: 'SELECT_PLAYER', payload: selected });
  };

  return (
    <ScreenWrapper>
      {/* Header */}
      <div className="text-center mb-6">
        <div className="text-3xl mb-2">{state.selectedCountry?.flag}</div>
        <h1 className="text-2xl font-bold text-text-primary mb-1">
          Choose Your Player
        </h1>
        <p className="text-sm text-text-secondary">
          Select a player from {state.selectedCountry?.name}
        </p>
      </div>

      {/* Players Grid */}
      <div className="grid grid-cols-5 gap-3 mb-8">
        {players.map((player, i) => {
          const isSelected = selected?.name === player.name;
          const color = avatarColors[i];
          return (
            <motion.button
              key={player.name}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.96 }}
              onClick={() => setSelected(player)}
              className={`flex flex-col items-center p-3.5 rounded-xl cursor-pointer transition-all duration-150 ${isSelected ? 'bg-primary-light border-2 border-primary shadow-sm' : 'bg-surface-alt border border-transparent hover:border-border hover:bg-white'}`}
            >
              <div
                className="w-11 h-11 rounded-full flex items-center justify-center text-lg mb-2 shrink-0"
                style={{ backgroundColor: `${color}12`, color }}
              >
                {player.emoji}
              </div>
              <span className={`text-[11px] font-semibold text-center leading-tight line-clamp-2 ${isSelected ? 'text-primary-dark' : 'text-text-primary'}`}>
                {player.name}
              </span>
              <span className="text-[9px] text-text-muted mt-0.5 text-center line-clamp-1">
                {player.description}
              </span>
            </motion.button>
          );
        })}
      </div>

      {/* VS Divider */}
      <div className="flex items-center gap-4 mb-6">
        <div className="flex-1 h-px bg-border" />
        <div className="w-8 h-8 rounded-full bg-red-500 flex items-center justify-center shadow-sm">
          <span className="text-[9px] font-extrabold text-white">VS</span>
        </div>
        <div className="flex-1 h-px bg-border" />
      </div>

      {/* Computer */}
      <div className="flex justify-center mb-8">
        <div className="bg-surface-alt rounded-2xl px-6 py-3.5 border border-border flex items-center gap-3.5">
          <div className="w-11 h-11 rounded-full bg-accent-light flex items-center justify-center text-lg">
            {'\u{1F916}'}
          </div>
          <div>
            <p className="text-sm font-bold text-text-primary">Computer</p>
            <span className={`inline-block text-[9px] font-bold px-2 py-0.5 rounded-full mt-0.5 uppercase tracking-wider ${state.difficulty === 'easy' ? 'bg-emerald-100 text-emerald-700' : state.difficulty === 'medium' ? 'bg-amber-100 text-amber-700' : 'bg-red-100 text-red-700'}`}>
              {state.difficulty} mode
            </span>
          </div>
        </div>
      </div>

      {/* Buttons */}
      <div className="flex justify-center gap-3">
        <Button variant="ghost" onClick={() => dispatch({ type: 'SET_SCREEN', payload: 'flag' })}>
          {"\u2190 Back"}
        </Button>
        <Button onClick={handleNext} disabled={!selected} size="lg" className="min-w-[200px]">
          {"Continue \u2192"}
        </Button>
      </div>
    </ScreenWrapper>
  );
}
