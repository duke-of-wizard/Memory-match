import { createContext, useContext, useReducer, type ReactNode, type Dispatch } from 'react';
import type { GameState, GameAction } from '../types/game';

const initialState: GameState = {
  screen: 'flag',
  difficulty: 'medium',
  selectedCountry: null,
  selectedPlayer: null,
  selectedCategory: null,
  board: [],
  playerScore: 0,
  computerScore: 0,
  currentTurn: 'player',
  flippedCards: [],
  computerMemory: {},
  isProcessing: false,
  isGameOver: false,
  winner: null,
};

function gameReducer(state: GameState, action: GameAction): GameState {
  switch (action.type) {
    case 'SET_DIFFICULTY':
      return { ...state, difficulty: action.payload };

    case 'SELECT_COUNTRY':
      return { ...state, selectedCountry: action.payload, screen: 'player' };

    case 'SELECT_PLAYER':
      return { ...state, selectedPlayer: action.payload, screen: 'category' };

    case 'SELECT_CATEGORY':
      return {
        ...state,
        selectedCategory: action.payload.category,
        board: action.payload.board,
        screen: 'board',
        playerScore: 0,
        computerScore: 0,
        currentTurn: 'player',
        flippedCards: [],
        computerMemory: {},
        isProcessing: false,
        isGameOver: false,
        winner: null,
      };

    case 'FLIP_CARD': {
      if (state.isProcessing) return state;
      if (state.flippedCards.length >= 2) return state;
      if (state.board[action.payload].isFlipped) return state;
      if (state.board[action.payload].isMatched) return state;

      const newBoard = state.board.map((card, i) =>
        i === action.payload ? { ...card, isFlipped: true } : card
      );
      return {
        ...state,
        board: newBoard,
        flippedCards: [...state.flippedCards, action.payload],
      };
    }

    case 'MATCH_FOUND': {
      const [i1, i2] = state.flippedCards;
      const newBoard = state.board.map((card, i) =>
        i === i1 || i === i2 ? { ...card, isMatched: true, isFlipped: true } : card
      );
      const isPlayer = state.currentTurn === 'player';
      const newPlayerScore = isPlayer ? state.playerScore + 1 : state.playerScore;
      const newComputerScore = !isPlayer ? state.computerScore + 1 : state.computerScore;

      const allMatched = newBoard.every(c => c.isMatched);

      return {
        ...state,
        board: newBoard,
        flippedCards: [],
        playerScore: newPlayerScore,
        computerScore: newComputerScore,
        isProcessing: false,
        isGameOver: allMatched,
        winner: allMatched
          ? newPlayerScore > newComputerScore
            ? 'player'
            : newComputerScore > newPlayerScore
              ? 'computer'
              : 'draw'
          : null,
      };
    }

    case 'NO_MATCH': {
      const [i1, i2] = state.flippedCards;
      const newBoard = state.board.map((card, i) =>
        i === i1 || i === i2 ? { ...card, isFlipped: false } : card
      );
      return {
        ...state,
        board: newBoard,
        flippedCards: [],
        isProcessing: false,
      };
    }

    case 'SWITCH_TURN':
      return {
        ...state,
        currentTurn: state.currentTurn === 'player' ? 'computer' : 'player',
        flippedCards: [],
      };

    case 'COMPUTER_OBSERVE': {
      return {
        ...state,
        computerMemory: {
          ...state.computerMemory,
          [action.payload.index]: action.payload.pairId,
        },
      };
    }

    case 'SET_PROCESSING':
      return { ...state, isProcessing: action.payload };

    case 'SET_SCREEN':
      return { ...state, screen: action.payload };

    case 'GAME_OVER': {
      const w = state.playerScore > state.computerScore
        ? 'player'
        : state.computerScore > state.playerScore
          ? 'computer'
          : 'draw';
      return { ...state, isGameOver: true, winner: w, screen: 'results' };
    }

    case 'RESET_GAME':
      return { ...initialState };

    default:
      return state;
  }
}

const GameContext = createContext<{
  state: GameState;
  dispatch: Dispatch<GameAction>;
} | null>(null);

export function GameProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(gameReducer, initialState);
  return (
    <GameContext.Provider value={{ state, dispatch }}>
      {children}
    </GameContext.Provider>
  );
}

export function useGame() {
  const context = useContext(GameContext);
  if (!context) throw new Error('useGame must be used within GameProvider');
  return context;
}
