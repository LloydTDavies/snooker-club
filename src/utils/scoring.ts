import { GameHistory, isFoul, isPot } from "../types";

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
  
  export function deriveScore(gameHistory: GameHistory[], playerName: string): number {
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