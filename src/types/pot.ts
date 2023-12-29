import { Ball } from "./ball";

export type Miss = {
  value: number;
  name: "Miss";
};

export type Foul = {
  value: number;
  name: "Foul";
};

export type NonPot = Miss | Foul;

export function isFoul(nonPot: Ball | NonPot): nonPot is Foul {
  return (nonPot as Foul)?.name === "Foul";
}

export function isPot(pot: Ball | NonPot): pot is Ball {
  return (pot as Ball)?.color !== undefined;
}
