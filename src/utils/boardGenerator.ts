import type { Difficulty, Category, GameCard, CardContent } from '../types/game';
import { shuffle } from './shuffle';

const pairCounts: Record<Difficulty, number> = {
  easy: 15,
  medium: 21,
  hard: 32,
};

export function generateBoard(difficulty: Difficulty, category: Category): GameCard[] {
  const numPairs = pairCounts[difficulty];
  const selectedItems = category.items.slice(0, numPairs);

  const cards: GameCard[] = [];
  let id = 0;

  for (const item of selectedItems) {
    const pairId = `pair-${item.label}`;
    const content: CardContent = {
      id: `${category.id}-${item.label}`,
      display: item.display,
      label: item.label,
      pairId,
    };

    cards.push({ id: id++, content, isFlipped: false, isMatched: false });
    cards.push({ id: id++, content: { ...content, id: `${content.id}-2` }, isFlipped: false, isMatched: false });
  }

  return shuffle(cards);
}

export function getGridDimensions(difficulty: Difficulty): { cols: number; rows: number } {
  switch (difficulty) {
    case 'easy': return { cols: 6, rows: 5 };
    case 'medium': return { cols: 7, rows: 6 };
    case 'hard': return { cols: 8, rows: 8 };
  }
}
