import { GameNotJoinableError } from "./errors/GameNotJoinableError";
import { MoveForbiddenError } from "./errors/MoveForbiddenError";
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
  result: null,
});

const isJoinableState = (game: Game): game is GameWaitingForPlayerToJoin => game.state === State.WaitingForPlayerToJoin;
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

const firstMove = (game: GameWaitingForFirstMove, playerMove: PlayerMove): GameWaitingForSecondMove => ({
  ...game,
  state: State.WaitingForSecondMove,
  moves: [playerMove],
});

const secondMove = (
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
        winner: null,
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

const isWaitingForFirstMove = (game: Game): game is GameWaitingForFirstMove => game.state === State.WaitingForFirstMove;
const isWaitingForSecondMove = (game: Game): game is GameWaitingForSecondMove =>
  game.state === State.WaitingForSecondMove;
const isPossibleToMakeMove = (game: Game) => isWaitingForFirstMove(game) || isWaitingForSecondMove(game);
const isPlayerPartOfTheGame = (game: Game, player: Player) => !!game.players.find(({ name }) => name === player.name);
const hasPlayerMadeMove = (game: GameWaitingForSecondMove, player: Player) => game.moves[0].player.name === player.name;

export const makeMove = (game: Game, playerMove: PlayerMove) => {
  if (!isPossibleToMakeMove(game)) {
    throw new MoveForbiddenError("Game does not accept any moves at this moment");
  }

  if (!isPlayerPartOfTheGame(game, playerMove.player)) {
    throw new MoveForbiddenError("Player making move is not part of this game");
  }

  if (isWaitingForSecondMove(game) && hasPlayerMadeMove(game, playerMove.player)) {
    throw new MoveForbiddenError("Player has already made a move");
  }

  return isWaitingForFirstMove(game)
    ? firstMove(game, playerMove)
    : secondMove(game as GameWaitingForSecondMove, playerMove);
};

export const getPublicViewModel = (game: Game) => {
  if (game.state === State.WaitingForSecondMove) {
    return { ...game, moves: null };
  }

  return game;
};
