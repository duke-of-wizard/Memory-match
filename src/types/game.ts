export type Difficulty = 'easy' | 'medium' | 'hard';

export type GameScreen = 'flag' | 'player' | 'category' | 'board' | 'results';

export interface Country {
  code: string;
  name: string;
  flag: string;
}

export interface Player {
  name: string;
  description: string;
  emoji: string;
}

export interface CardContent {
  id: string;
  display: string;
  label: string;
  pairId: string;
}

export interface GameCard {
  id: number;
  content: CardContent;
  isFlipped: boolean;
  isMatched: boolean;
}

export interface Category {
  id: string;
  name: string;
  icon: string;
  description: string;
  items: { display: string; label: string }[];
}

export interface GameState {
  screen: GameScreen;
  difficulty: Difficulty;
  selectedCountry: Country | null;
  selectedPlayer: Player | null;
  selectedCategory: Category | null;
  board: GameCard[];
  playerScore: number;
  computerScore: number;
  currentTurn: 'player' | 'computer';
  flippedCards: number[];
  computerMemory: Record<number, string>;
  isProcessing: boolean;
  isGameOver: boolean;
  winner: 'player' | 'computer' | 'draw' | null;
}

export type GameAction =
  | { type: 'SET_DIFFICULTY'; payload: Difficulty }
  | { type: 'SELECT_COUNTRY'; payload: Country }
  | { type: 'SELECT_PLAYER'; payload: Player }
  | { type: 'SELECT_CATEGORY'; payload: { category: Category; board: GameCard[] } }
  | { type: 'FLIP_CARD'; payload: number }
  | { type: 'MATCH_FOUND' }
  | { type: 'NO_MATCH' }
  | { type: 'SWITCH_TURN' }
  | { type: 'COMPUTER_OBSERVE'; payload: { index: number; pairId: string } }
  | { type: 'SET_PROCESSING'; payload: boolean }
  | { type: 'SET_SCREEN'; payload: GameScreen }
  | { type: 'GAME_OVER' }
  | { type: 'RESET_GAME' };
