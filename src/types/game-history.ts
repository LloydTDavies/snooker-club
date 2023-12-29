import { Ball, NonPot } from ".";

export type GameHistory = {
  player: string;
  pot: Ball | NonPot;
};
