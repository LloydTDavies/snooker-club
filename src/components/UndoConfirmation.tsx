import { GameHistory, isFoul, isPot } from "../types";

type UndoConfirmationProps = {
  gameHistory: GameHistory[];
  onConfirmUndo: () => void;
  onDismiss: () => void;
};

function deriveLastTurn(gameHistory: GameHistory[]): string {
  const lastTurn = gameHistory[0];
  if (isPot(lastTurn.pot)) {
    return `${lastTurn.player}'s ${lastTurn.pot.color}`;
  } else if (isFoul(lastTurn.pot)) {
    return `${lastTurn.player} fouled`;
  }
  return `${lastTurn.player} missed`;
}

export default function UndoConfirmation({
  gameHistory,
  onConfirmUndo,
  onDismiss,
}: UndoConfirmationProps) {
  const lastTurn = deriveLastTurn(gameHistory);

  return (
    <div className="undo-confirmation">
      Are you sure you want to undo your last move?
      <p>{lastTurn}</p>
      <div>
        <button onClick={onConfirmUndo}>Yes</button>
        <button onClick={onDismiss}>No</button>
      </div>
    </div>
  );
}
