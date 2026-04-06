import { useCallback } from 'react';
import type { Difficulty, GameCard } from '../types/game';

const memoryChance: Record<Difficulty, number> = {
  easy: 0.2,
  medium: 0.5,
  hard: 0.8,
};

export function useComputerAI(
  difficulty: Difficulty,
  board: GameCard[],
  computerMemory: Record<number, string>,
  dispatch: React.Dispatch<any>
) {
  const observeCard = useCallback(
    (index: number, pairId: string) => {
      if (Math.random() < memoryChance[difficulty]) {
        dispatch({ type: 'COMPUTER_OBSERVE', payload: { index, pairId } });
      }
    },
    [difficulty, dispatch]
  );

  const findMove = useCallback((): [number, number] => {
    const unmatched = board
      .map((card, i) => ({ card, index: i }))
      .filter(({ card }) => !card.isMatched && !card.isFlipped);

    // Check memory for known pairs
    const memEntries = Object.entries(computerMemory);
    for (let i = 0; i < memEntries.length; i++) {
      const [idx1Str, pairId1] = memEntries[i];
      const idx1 = parseInt(idx1Str);
      if (board[idx1]?.isMatched) continue;

      for (let j = i + 1; j < memEntries.length; j++) {
        const [idx2Str, pairId2] = memEntries[j];
        const idx2 = parseInt(idx2Str);
        if (board[idx2]?.isMatched) continue;

        if (pairId1 === pairId2 && idx1 !== idx2) {
          return [idx1, idx2];
        }
      }
    }

    // No known pair: pick first random card
    const shuffled = [...unmatched].sort(() => Math.random() - 0.5);
    const first = shuffled[0]?.index ?? 0;

    // Check if memory knows a match for card at 'first'
    const firstPairId = board[first]?.content.pairId;
    const memMatch = memEntries.find(
      ([idxStr, pid]) => pid === firstPairId && parseInt(idxStr) !== first && !board[parseInt(idxStr)]?.isMatched
    );

    if (memMatch) {
      return [first, parseInt(memMatch[0])];
    }

    // Pick second random card (different from first)
    const second = shuffled.find(s => s.index !== first)?.index ?? shuffled[1]?.index ?? 1;
    return [first, second];
  }, [board, computerMemory]);

  return { observeCard, findMove };
}
