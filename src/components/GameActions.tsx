import { useState } from "react";
import { Ball } from "../types";
import { ALL_BALLS, BALLS } from "../utils/data";
import "./GameActions.css";

type GameActionsProps = {
  onBallClick: (ball: Ball) => void;
  onMissClick: () => void;
  onFoulClick: () => void;
  onEndGameClick: () => void;
};

export default function GameActions({
  onBallClick,
  onMissClick,
  onFoulClick,
  onEndGameClick,
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
      <button
        className={classes.join(" ")}
        key={ball.color}
        onClick={() => handleBallClick(ball)}
        disabled={isDisabled}
      >
        {ball.color}
      </button>
    );
  });

  const hasRemaining = Object.values(ballsRemaining).some((left) => left > 0);

  if (!hasRemaining) {
    onEndGameClick();
  }

  return (
    <section>
      <div>{ballButtons}</div>
      <div>
        <button onClick={onFoulClick} disabled={!hasRemaining}>
          Foul
        </button>
        <button onClick={onMissClick} disabled={!hasRemaining}>
          Miss
        </button>
        <button onClick={onEndGameClick}>End Game</button>
      </div>
    </section>
  );
}
