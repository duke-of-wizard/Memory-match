import { GameProvider, useGame } from './context/GameContext';
import { FlagSelectionScreen } from './screens/FlagSelectionScreen';
import { PlayerSelectionScreen } from './screens/PlayerSelectionScreen';
import { CategorySelectionScreen } from './screens/CategorySelectionScreen';
import { GameBoardScreen } from './screens/GameBoardScreen';
import { ResultsScreen } from './screens/ResultsScreen';

function GameRouter() {
  const { state } = useGame();

  switch (state.screen) {
    case 'flag': return <FlagSelectionScreen />;
    case 'player': return <PlayerSelectionScreen />;
    case 'category': return <CategorySelectionScreen />;
    case 'board': return <GameBoardScreen />;
    case 'results': return <ResultsScreen />;
  }
}

function App() {
  return (
    <GameProvider>
      <GameRouter />
    </GameProvider>
  );
}

export default App;
