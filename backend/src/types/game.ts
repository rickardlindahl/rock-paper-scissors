export interface Player {
  name: string;
}

export enum Move {
  Rock = "ROCK",
  Paper = "PAPER",
  Scissors = "SCISSORS",
}

export interface PlayerMove {
  player: Player;
  move: Move;
}

export enum State {
  WaitingForPlayerToJoin = "WAITING_FOR_OPPONENT_TO_JOIN",
  WaitingForFirstMove = "WAITING_FOR_FIRST_MOVE",
  WaitingForSecondMove = "WAITING_FOR_SECOND_MOVE",
  Finished = "FINISHED",
}

export enum Outcome {
  Winner = "WINNER",
  Draw = "DRAW",
}

export interface RockPaperScissorsGame {
  id: string;
  state: State;
  players: [] | [Player] | [Player, Player];
  moves: [] | [PlayerMove] | [PlayerMove, PlayerMove];
  result: undefined | { outcome: Outcome.Draw; winner: undefined } | { outcome: Outcome.Winner; winner: Player };
}

export interface GameWaitingForPlayerToJoin extends RockPaperScissorsGame {
  state: State.WaitingForPlayerToJoin;
  players: [Player];
  moves: [];
  result: undefined;
}

export interface GameWaitingForFirstMove extends RockPaperScissorsGame {
  state: State.WaitingForFirstMove;
  players: [Player, Player];
  moves: [];
  result: undefined;
}

export interface GameWaitingForSecondMove extends RockPaperScissorsGame {
  state: State.WaitingForSecondMove;
  players: [Player, Player];
  moves: [PlayerMove];
  result: undefined;
}

export interface GameFinishedAsDraw extends RockPaperScissorsGame {
  state: State.Finished;
  players: [Player, Player];
  moves: [PlayerMove, PlayerMove];
  result: {
    outcome: Outcome.Draw;
    winner: undefined;
  };
}

export interface GameFinishedWithWinner extends RockPaperScissorsGame {
  state: State.Finished;
  players: [Player, Player];
  moves: [PlayerMove, PlayerMove];
  result: {
    outcome: Outcome.Winner;
    winner: Player;
  };
}

export type Game =
  | GameWaitingForPlayerToJoin
  | GameWaitingForFirstMove
  | GameWaitingForSecondMove
  | GameFinishedAsDraw
  | GameFinishedWithWinner;
