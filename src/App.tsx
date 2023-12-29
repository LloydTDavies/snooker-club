import { useState } from "react";
import "./App.css";
import GameActions from "./components/GameActions";
import {
  Ball,
  Foul,
  GameHistory,
  Miss,
  Player as GamePlayer,
  isFoul,
  isPot,
} from "./types";
import Player from "./components/Player";

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

function deriveScoreFromFouls(
  gameHistory: GameHistory[],
  playerName: string
): number {
  return gameHistory
    .filter((turn) => isFoul(turn.pot) && turn.player !== playerName)
    .reduce((score, turn) => {
      if (isFoul(turn.pot)) {
        return score + turn.pot.value;
      }

      return score;
    }, 0);
}

function deriveScore(gameHistory: GameHistory[], playerName: string): number {
  const playerHistory = gameHistory.filter(
    (turn) => turn.player === playerName
  );

  const pottedScore = playerHistory.reduce((score, turn) => {
    if (isPot(turn.pot)) {
      return score + turn.pot.value;
    }
    return score;
  }, 0);

  return pottedScore + deriveScoreFromFouls(gameHistory, playerName);
}

function App() {
  const [players, setPlayers] = useState([...PLAYERS]);
  const [gameHistory, setGameHistory] = useState<GameHistory[]>([]);
  const [isGameInProgress, setIsGameInProgress] = useState(true);

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

  const currentPlayer = deriveCurrentPlayer(gameHistory, players);

  if (!isGameInProgress) {
    return (
      <div>
        <h1>Game Over</h1>
        <h2>Final Scores</h2>
        <div>Player 1: {deriveScore(gameHistory, players[0].name)}</div>
        <div>Player 2: {deriveScore(gameHistory, players[1].name)}</div>
        <button onClick={newGameHandler}>New Game</button>
      </div>
    );
  }

  return (
    <main>
      <section id="players">
        {players.map(({ name }) => (
          <Player
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
      />
    </main>
  );
}

export default App;
