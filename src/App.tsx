import { useState } from "react";
import "./App.css";
import GameActions from "./components/GameActions";
import {
  Ball,
  Foul,
  GameHistory,
  Miss,
  Player as GamePlayer,
  isPot,
} from "./types";
import Player from "./components/Player";
import UndoConfirmation from "./components/UndoConfirmation";
import GameOver from "./components/GameOver";
import { deriveScore } from "./utils/scoring";

const PLAYERS: GamePlayer[] = [{ name: "Player 1" }, { name: "Player 2" }];

function deriveCurrentPlayer(
  gameHistory: GameHistory[],
  players: GamePlayer[]
): string {
  if (gameHistory.length === 0) {
    return players[0].name;
  }

  const lastTurn = gameHistory[0];

  if (isPot(lastTurn.pot)) {
    return lastTurn.player;
  }

  return players.filter((player) => player.name !== lastTurn.player)[0].name;
}


function App() {
  const [players, setPlayers] = useState([...PLAYERS]);
  const [gameHistory, setGameHistory] = useState<GameHistory[]>([]);
  const [isGameInProgress, setIsGameInProgress] = useState(true);
  const [isUndoEnabled, setIsUndoEnabled] = useState(false);

  void [setPlayers];

  const handleBallClick = (ball: Ball) => {
    const currentPlayer = deriveCurrentPlayer(gameHistory, players);
    console.log(`Player ${currentPlayer} potted ${ball.color}`);
    setGameHistory((previousGameHistory) => {
      const newHistory = [...previousGameHistory];
      newHistory.splice(0, 0, { player: currentPlayer, pot: ball });
      return newHistory;
    });
  };

  const handleMissClick = () => {
    const currentPlayer = deriveCurrentPlayer(gameHistory, players);
    console.log(`Player ${currentPlayer} missed`);
    setGameHistory((previousGameHistory) => {
      const newHistory = [...previousGameHistory];
      newHistory.splice(0, 0, {
        player: currentPlayer,
        pot: { name: "Miss", value: 0 } as Miss,
      });
      return newHistory;
    });
  };

  const handleFoulClick = () => {
    const currentPlayer = deriveCurrentPlayer(gameHistory, players);
    console.log(`Player ${currentPlayer} fouled`);
    setGameHistory((previousGameHistory) => {
      const newHistory = [...previousGameHistory];
      newHistory.splice(0, 0, {
        player: currentPlayer,
        pot: { name: "Foul", value: 4 } as Foul,
      });
      return newHistory;
    });
  };

  //Bug around here. When player pots last black isn't added to the score total
  const endGameHandler = () => {
    setIsGameInProgress(false);
  };

  const newGameHandler = () => {
    setIsGameInProgress(true);
    setGameHistory([]);
  };

  const handleUndoClick = () => {
    setIsUndoEnabled(false);
    setGameHistory((previousGameHistory) => {
      const newHistory = [...previousGameHistory];
      newHistory.splice(0, 1);
      return newHistory;
    });
  };

  const currentPlayer = deriveCurrentPlayer(gameHistory, players);

  if (!isGameInProgress) {
    return (
     <GameOver gameHistory={gameHistory} players={players} onNewGame={newGameHandler} />
    );
  }

  if (isUndoEnabled) {
    return (
      <UndoConfirmation
        gameHistory={gameHistory}
        onConfirmUndo={() => handleUndoClick()}
        onDismiss={() => setIsUndoEnabled(false)}
      />
    );
  }

  return (
    <main>
      <section id="players">
        {players.map(({ name }) => (
          <Player
            key={name}
            name={name}
            score={deriveScore(gameHistory, name)}
            active={name === currentPlayer}
          />
        ))}
      </section>
      <GameActions
        onBallClick={handleBallClick}
        onMissClick={handleMissClick}
        onFoulClick={handleFoulClick}
        onEndGameClick={endGameHandler}
        showUndo={gameHistory.length > 0}
        onUndoClick={() => setIsUndoEnabled(true)}
      />
    </main>
  );
}

export default App;
