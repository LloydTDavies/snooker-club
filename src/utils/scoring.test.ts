import { expect, it, describe } from "vitest";
import { GameHistory } from "../types";
import { deriveScore } from "./scoring";

describe("deriveScore", () => {
  it("should return 0 if no player has potted", () => {
    const gameHistory: GameHistory[] = [
      { player: "Player 1", pot: { name: "Miss", value: 0 } },
      { player: "Player 2", pot: { name: "Miss", value: 0 } },
    ];
    expect(deriveScore(gameHistory, "Player 1")).toBe(0);
  });

  it("should return 8 if player has potted red and black", () => {
    const gameHistory: GameHistory[] = [
      { player: "Player 1", pot: { color: "red", value: 1 } },
      { player: "Player 1", pot: { color: "black", value: 7 } },
    ];
    expect(deriveScore(gameHistory, "Player 1")).toBe(8);
  });
});
