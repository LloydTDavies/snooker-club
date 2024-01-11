import { GameHistory, Player, isFoul, isPot } from "../types";
import { deriveScore } from "../utils/scoring";

type GameOverProps = {
    gameHistory: GameHistory[],
    players: Player[],
    onNewGame: () => void
};

function deriveTurnText(turn: GameHistory): string {
    if (isPot(turn.pot)) {
      return `${turn.player}'s ${turn.pot.color}`;
    } else if (isFoul(turn.pot)) {
      return `${turn.player} fouled`;
    }
    return `${turn.player} missed`;
  }

export default function GameOver({ gameHistory, players, onNewGame }: GameOverProps) {
  return (
    <div>
      <h1>Game Over</h1>
      <h2>Final Scores</h2>
      <div>Player 1: {deriveScore(gameHistory, players[0].name)}</div>
      <div>Player 2: {deriveScore(gameHistory, players[1].name)}</div>
      <button onClick={onNewGame}>New Game</button>

      <h2>Game History</h2>
      <ul>
        {gameHistory.map((turn, index) => (
          <li key={index}>
            {deriveTurnText(turn)}
          </li>
        ))}
      </ul>
    </div>
  );
}
