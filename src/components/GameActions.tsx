import { useState } from "react";
import { Ball } from "../types";
import { ALL_BALLS, BALLS } from "../utils/data";
import "./GameActions.css";

type GameActionsProps = {
  onBallClick: (ball: Ball) => void;
  onMissClick: () => void;
  onFoulClick: () => void;
  onEndGameClick: () => void;
  onUndoClick: () => void;
  showUndo: boolean;
};

export default function GameActions({
  onBallClick,
  onMissClick,
  onFoulClick,
  onEndGameClick,
  onUndoClick,
  showUndo,
}: GameActionsProps) {
  const [ballsRemaining, setBallsRemaining] = useState({ ...ALL_BALLS });

  function handleBallClick(ball: Ball) {
    if (ballsRemaining["red"] > 0 && ball.color !== "red") {
      onBallClick(ball);
    } else {
      setBallsRemaining((previousBallsRemaining) => {
        const newBallsRemaining = { ...previousBallsRemaining };
        newBallsRemaining[ball.color] -= 1;
        return newBallsRemaining;
      });
      onBallClick(ball);
    }
  }

  const ballButtons = BALLS.map((ball) => {
    const isDisabled = ballsRemaining[ball.color] === 0;
    const classes = ["ball", ball.color, isDisabled ? "disabled" : ""];
    return (
      <div>
        <button
          className={classes.join(" ")}
          key={ball.color}
          onClick={() => handleBallClick(ball)}
          disabled={isDisabled}
        >
          {ball.color}
        </button>
        <p>Remaining : {ballsRemaining[ball.color]}</p>
      </div>
    );
  });

  const hasRemaining = Object.values(ballsRemaining).some((left) => left > 0);

  if (!hasRemaining) {
    onEndGameClick();
  }

  return (
    <section id="game-actions">
      <div className="ball-container">{ballButtons} <button className="ball white" onClick={onMissClick} disabled={!hasRemaining}>
          Miss
        </button></div>
      <div className="non-pot-actions">
        <button onClick={onFoulClick} disabled={!hasRemaining}>
          Foul
        </button>
       
        <button onClick={onEndGameClick}>End Game</button>

        {showUndo && <button onClick={onUndoClick}>Undo</button>}
      </div>
    </section>
  );
}
