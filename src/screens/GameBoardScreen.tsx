import { useEffect, useCallback, useRef } from 'react';
import { useGame } from '../context/GameContext';
import { useTimer } from '../hooks/useTimer';
import { useComputerAI } from '../hooks/useComputerAI';
import { getGridDimensions } from '../utils/boardGenerator';
import { GameCard } from '../components/game/GameCard';
import { Scoreboard } from '../components/game/Scoreboard';

export function GameBoardScreen() {
  const { state, dispatch } = useGame();
  const computerTurnRef = useRef(false);
  const matchCheckRef = useRef(false);

  const { observeCard, findMove } = useComputerAI(
    state.difficulty, state.board, state.computerMemory, dispatch
  );

  const handleTimeout = useCallback(() => {
    if (state.isGameOver) return;
    dispatch({ type: 'SWITCH_TURN' });
  }, [dispatch, state.isGameOver]);

  const timerActive = !state.isGameOver && !state.isProcessing && state.currentTurn === 'player';
  const { timeRemaining, resetTimer } = useTimer(20, handleTimeout, timerActive);

  useEffect(() => {
    if (state.flippedCards.length !== 2) { matchCheckRef.current = false; return; }
    if (matchCheckRef.current) return;
    matchCheckRef.current = true;
    dispatch({ type: 'SET_PROCESSING', payload: true });
    const [i1, i2] = state.flippedCards;
    const card1 = state.board[i1], card2 = state.board[i2];
    setTimeout(() => { observeCard(i1, card1.content.pairId); observeCard(i2, card2.content.pairId); }, 0);
    const isMatch = card1.content.pairId === card2.content.pairId;
    const timer = setTimeout(() => {
      if (isMatch) { dispatch({ type: 'MATCH_FOUND' }); resetTimer(); }
      else { dispatch({ type: 'NO_MATCH' }); setTimeout(() => dispatch({ type: 'SWITCH_TURN' }), 300); }
    }, 800);
    return () => clearTimeout(timer);
  }, [state.flippedCards]);

  useEffect(() => {
    if (state.currentTurn !== 'computer') { computerTurnRef.current = false; return; }
    if (state.isGameOver || state.isProcessing) return;
    if (computerTurnRef.current) return;
    computerTurnRef.current = true;
    resetTimer();
    const [first, second] = findMove();
    const t1 = setTimeout(() => {
      dispatch({ type: 'FLIP_CARD', payload: first });
      setTimeout(() => { dispatch({ type: 'FLIP_CARD', payload: second }); computerTurnRef.current = false; }, 800);
    }, 1200);
    return () => clearTimeout(t1);
  }, [state.currentTurn, state.isGameOver, state.isProcessing]);

  useEffect(() => { resetTimer(); }, [state.currentTurn]);
  useEffect(() => {
    if (state.isGameOver && state.winner) {
      const t = setTimeout(() => dispatch({ type: 'SET_SCREEN', payload: 'results' }), 1500);
      return () => clearTimeout(t);
    }
  }, [state.isGameOver, state.winner]);

  const { cols } = getGridDimensions(state.difficulty);
  const isAirline = state.selectedCategory?.id === 'airlines';
  const totalPairs = state.board.length / 2;
  const matchedPairs = state.playerScore + state.computerScore;

  const handleCardClick = useCallback((index: number) => {
    if (state.currentTurn !== 'player' || state.isProcessing || state.flippedCards.length >= 2) return;
    dispatch({ type: 'FLIP_CARD', payload: index });
  }, [state.currentTurn, state.isProcessing, state.flippedCards.length, dispatch]);

  const gridColsClass = { 6: 'grid-cols-6', 7: 'grid-cols-7', 8: 'grid-cols-8' }[cols] || 'grid-cols-6';

  return (
    <div className="w-full flex justify-center py-4 md:py-6 px-3 animate-[fadeIn_0.3s_ease-out]">
      <div className="w-full max-w-3xl bg-white rounded-3xl shadow-[0_1px_3px_rgba(0,0,0,0.06),0_8px_24px_rgba(0,0,0,0.04)] border border-border-light px-4 py-5 md:px-6 md:py-6">
        <Scoreboard
          playerName={state.selectedPlayer?.name || 'Player'}
          playerEmoji={state.selectedPlayer?.emoji || '\u{1F464}'}
          playerScore={state.playerScore}
          computerScore={state.computerScore}
          currentTurn={state.currentTurn}
          timeRemaining={timeRemaining}
          matchedPairs={matchedPairs}
          totalPairs={totalPairs}
        />

        <div className={`grid ${gridColsClass} gap-1.5 md:gap-2`}>
          {state.board.map((card, index) => (
            <GameCard
              key={card.id}
              card={card}
              onClick={() => handleCardClick(index)}
              disabled={state.currentTurn !== 'player' || state.isProcessing}
              isAirline={isAirline}
            />
          ))}
        </div>

        {state.isGameOver && (
          <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 animate-[fadeIn_0.3s_ease-out]">
            <div className="bg-white rounded-3xl p-8 text-center shadow-2xl animate-[fadeInScale_0.4s_ease-out]">
              <p className="text-5xl mb-3">
                {state.winner === 'player' ? '\u{1F3C6}' : state.winner === 'computer' ? '\u{1F916}' : '\u{1F91D}'}
              </p>
              <p className="text-xl font-bold text-text-primary">
                {state.winner === 'player' ? 'You Win!' : state.winner === 'computer' ? 'Computer Wins!' : "It's a Draw!"}
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
