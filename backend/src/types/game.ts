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

export type Players = [] | [Player] | [Player, Player];

export type Moves = [] | [PlayerMove] | [PlayerMove, PlayerMove];

export type Result = undefined | { outcome: Outcome.Draw } | { outcome: Outcome.Winner; winner: Player };

export interface RockPaperScissorsGame<S extends State, P = Players, M = Moves, R = Result> {
  id: string;
  state: S;
  players: P;
  moves: M;
  result: R;
}

export type GameWaitingForPlayerToJoin = RockPaperScissorsGame<State.WaitingForPlayerToJoin, [Player], [], undefined>;

export type GameWaitingForFirstMove = RockPaperScissorsGame<State.WaitingForFirstMove, [Player, Player], [], undefined>;

export type GameWaitingForSecondMove = RockPaperScissorsGame<
  State.WaitingForSecondMove,
  [Player, Player],
  [PlayerMove],
  undefined
>;

export type GameFinishedAsDraw = RockPaperScissorsGame<
  State.Finished,
  [Player, Player],
  [PlayerMove, PlayerMove],
  {
    outcome: Outcome.Draw;
    winner: undefined;
  }
>;

export type GameFinishedWithWinner = RockPaperScissorsGame<
  State.Finished,
  [Player, Player],
  [PlayerMove, PlayerMove],
  {
    outcome: Outcome.Winner;
    winner: Player;
  }
>;

export type Game =
  | GameWaitingForPlayerToJoin
  | GameWaitingForFirstMove
  | GameWaitingForSecondMove
  | GameFinishedAsDraw
  | GameFinishedWithWinner;
