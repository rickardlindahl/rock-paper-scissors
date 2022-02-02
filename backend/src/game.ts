import { GameNotJoinableError } from "./errors/GameNotJoinableError";
import { PlayerNameConflictError } from "./errors/PlayerNameConflictError";
import {
  Game,
  GameFinishedAsDraw,
  GameFinishedWithWinner,
  GameWaitingForFirstMove,
  GameWaitingForPlayerToJoin,
  GameWaitingForSecondMove,
  Move,
  Outcome,
  Player,
  PlayerMove,
  State,
} from "./types/game";

const winMap: { [key in Move]: Move } = {
  [Move.Paper]: Move.Rock,
  [Move.Rock]: Move.Scissors,
  [Move.Scissors]: Move.Paper,
};

const isMove1Winner = (move1: Move, move2: Move): boolean => winMap[move1] === move2;

const isDraw = (move1: Move, move2: Move): boolean => move1 === move2;

export const createGame = (id: string, player: Player): GameWaitingForPlayerToJoin => ({
  id,
  state: State.WaitingForPlayerToJoin,
  players: [player],
  moves: [],
  result: undefined,
});

const isJoinableState = (g: Game): g is GameWaitingForPlayerToJoin => g.state === State.WaitingForPlayerToJoin;
const isPlayerNameConflict = (player1: Player, player2: Player) => player1.name === player2.name;

export const joinGame = (game: Game, player: Player): GameWaitingForFirstMove => {
  if (!isJoinableState(game)) {
    throw new GameNotJoinableError("Game is not joinable");
  }

  if (isPlayerNameConflict(game.players[0], player)) {
    throw new PlayerNameConflictError("A player with that name has already joined the game");
  }

  return {
    ...game,
    state: State.WaitingForFirstMove,
    players: [game.players[0], player],
  };
};

export const firstMove = (game: GameWaitingForFirstMove, playerMove: PlayerMove): GameWaitingForSecondMove => ({
  ...game,
  state: State.WaitingForSecondMove,
  moves: [playerMove],
});

export const secondMove = (
  game: GameWaitingForSecondMove,
  playerMove: PlayerMove,
): GameFinishedAsDraw | GameFinishedWithWinner => {
  const {
    moves: [move1],
    ...rest
  } = game;

  const moves: [PlayerMove, PlayerMove] = [move1, playerMove];

  if (isDraw(move1.move, playerMove.move)) {
    return {
      ...rest,
      state: State.Finished,
      moves,
      result: {
        outcome: Outcome.Draw,
        winner: undefined,
      },
    };
  }

  return {
    ...rest,
    state: State.Finished,
    moves,
    result: {
      outcome: Outcome.Winner,
      winner: isMove1Winner(move1.move, playerMove.move) ? move1.player : playerMove.player,
    },
  };
};

export const getPublicViewModel = (game: Game) => {
  if (game.state === State.WaitingForSecondMove) {
    return { ...game, moves: undefined };
  }

  return game;
};
