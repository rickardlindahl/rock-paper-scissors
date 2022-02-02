import { expect } from "@hapi/code";
import * as Lab from "@hapi/lab";
import { createGame, joinGame, makeMove } from "./game";
import {
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

const lab = Lab.script();
const { describe, it } = lab;
export { lab };

describe("Game logic", () => {
  const id = "123";
  const playerPelle: Player = { name: "Pelle" };
  const playerLisa: Player = { name: "Lisa" };
  const playerHacker: Player = { name: "Hacker" };

  describe("Create game", () => {
    it("should return a new game", () => {
      const expected: GameWaitingForPlayerToJoin = {
        id,
        state: State.WaitingForPlayerToJoin,
        players: [playerPelle],
        moves: [],
        result: undefined,
      };

      expect(createGame(id, playerPelle)).to.equal(expected);
    });
  });

  describe("Join game", () => {
    it("should throw an error when trying to join a new game and player names are equal", () => {
      const game = createGame(id, playerPelle);

      expect(() => joinGame(game, playerPelle)).to.throw("A player with that name has already joined the game");
    });

    it(`should throw an error when trying to join a game that is in state ${State.WaitingForFirstMove}`, () => {
      const game: GameWaitingForFirstMove = {
        id,
        state: State.WaitingForFirstMove,
        players: [playerPelle, playerLisa],
        moves: [],
        result: undefined,
      };

      expect(() => joinGame(game, playerLisa)).to.throw("Game is not joinable");
    });

    it(`should throw an error when trying to join a game that is in state ${State.WaitingForSecondMove}`, () => {
      const game = makeMove(joinGame(createGame(id, playerPelle), playerLisa), {
        player: playerPelle,
        move: Move.Rock,
      });

      expect(game.state).to.equal(State.WaitingForSecondMove);

      expect(() => joinGame(game, playerLisa)).to.throw("Game is not joinable");
    });

    it(`should throw an error when trying to join a game that is in state ${State.Finished}`, () => {
      const game: GameFinishedAsDraw = {
        id,
        state: State.Finished,
        players: [playerPelle, playerLisa],
        moves: [
          { player: playerPelle, move: Move.Paper },
          { player: playerLisa, move: Move.Paper },
        ],
        result: {
          outcome: Outcome.Draw,
          winner: undefined,
        },
      };

      expect(() => joinGame(game, playerLisa)).to.throw("Game is not joinable");
    });

    it(`should return a game with state = ${State.WaitingForFirstMove} when successfully joining a new game`, () => {
      const game = createGame(id, playerPelle);

      const expected: GameWaitingForFirstMove = {
        id,
        state: State.WaitingForFirstMove,
        players: [playerPelle, playerLisa],
        moves: [],
        result: undefined,
      };

      expect(joinGame(game, playerLisa)).to.equal(expected);
    });
  });

  describe("Make move", () => {
    it(`should throw an error when trying to make a move on a game with state ${State.WaitingForPlayerToJoin}`, () => {
      const game = createGame(id, playerPelle);

      expect(() => makeMove(game, { player: playerPelle, move: Move.Paper })).to.throw(
        "Game does not accept any moves at this moment",
      );
    });

    it(`should throw an error when trying to make a move on a game with state ${State.Finished}`, () => {
      const game: GameFinishedAsDraw = {
        id,
        state: State.Finished,
        players: [playerPelle, playerLisa],
        moves: [
          { player: playerPelle, move: Move.Paper },
          { player: playerLisa, move: Move.Paper },
        ],
        result: {
          outcome: Outcome.Draw,
          winner: undefined,
        },
      };

      expect(() => makeMove(game, { player: playerPelle, move: Move.Paper })).to.throw(
        "Game does not accept any moves at this moment",
      );
    });

    it("should throw an error when trying to make a move with a player that is not a part of the game", () => {
      const game: GameWaitingForFirstMove = {
        id,
        state: State.WaitingForFirstMove,
        players: [playerPelle, playerLisa],
        moves: [],
        result: undefined,
      };

      expect(() => makeMove(game, { player: playerHacker, move: Move.Paper })).to.throw(
        "Player making move is not part of this game",
      );
    });

    it("should throw an error when trying to make a move with a player that has already made a move", () => {
      const game: GameWaitingForSecondMove = {
        id,
        state: State.WaitingForSecondMove,
        players: [playerPelle, playerLisa],
        moves: [{ player: playerPelle, move: Move.Paper }],
        result: undefined,
      };

      expect(() => makeMove(game, { player: playerPelle, move: Move.Rock })).to.throw("Player has already made a move");
    });

    it(`should return a game with state ${State.WaitingForSecondMove} when the player who created the game makes the first move`, () => {
      const game: GameWaitingForFirstMove = {
        id,
        state: State.WaitingForFirstMove,
        players: [playerPelle, playerLisa],
        moves: [],
        result: undefined,
      };

      const playerMove: PlayerMove = { player: playerPelle, move: Move.Rock };

      const expected: GameWaitingForSecondMove = {
        ...game,
        state: State.WaitingForSecondMove,
        moves: [playerMove],
      };

      expect(makeMove(game, playerMove)).to.equal(expected);
    });

    it(`should return a game with state ${State.WaitingForSecondMove} when the player who joined the game last makes the first move`, () => {
      const game: GameWaitingForFirstMove = {
        id,
        state: State.WaitingForFirstMove,
        players: [playerPelle, playerLisa],
        moves: [],
        result: undefined,
      };

      const playerMove: PlayerMove = { player: playerLisa, move: Move.Rock };

      const expected: GameWaitingForSecondMove = {
        ...game,
        state: State.WaitingForSecondMove,
        moves: [playerMove],
      };

      expect(makeMove(game, playerMove)).to.equal(expected);
    });

    it(`should return a game with state ${State.Finished} and outcome ${Outcome.Draw} when the players makes the same move - ${Move.Rock}`, () => {
      const game: GameWaitingForFirstMove = {
        id,
        state: State.WaitingForFirstMove,
        players: [playerPelle, playerLisa],
        moves: [],
        result: undefined,
      };

      const playerPelleMove: PlayerMove = { player: playerPelle, move: Move.Rock };
      const playerLisaMove: PlayerMove = { player: playerLisa, move: Move.Rock };

      const expected: GameFinishedAsDraw = {
        id,
        state: State.Finished,
        players: [playerPelle, playerLisa],
        moves: [playerPelleMove, playerLisaMove],
        result: {
          outcome: Outcome.Draw,
          winner: undefined,
        },
      };

      expect(makeMove(makeMove(game, playerPelleMove), playerLisaMove)).to.equal(expected);
    });

    it(`should return a game with state ${State.Finished} and outcome ${Outcome.Draw} when the players makes the same move - ${Move.Paper}`, () => {
      const game: GameWaitingForFirstMove = {
        id,
        state: State.WaitingForFirstMove,
        players: [playerPelle, playerLisa],
        moves: [],
        result: undefined,
      };

      const playerPelleMove: PlayerMove = { player: playerPelle, move: Move.Paper };
      const playerLisaMove: PlayerMove = { player: playerLisa, move: Move.Paper };

      const expected: GameFinishedAsDraw = {
        id,
        state: State.Finished,
        players: [playerPelle, playerLisa],
        moves: [playerPelleMove, playerLisaMove],
        result: {
          outcome: Outcome.Draw,
          winner: undefined,
        },
      };

      expect(makeMove(makeMove(game, playerPelleMove), playerLisaMove)).to.equal(expected);
    });

    it(`should return a game with state ${State.Finished} and outcome ${Outcome.Draw} when the players makes the same move - ${Move.Scissors}`, () => {
      const game: GameWaitingForFirstMove = {
        id,
        state: State.WaitingForFirstMove,
        players: [playerPelle, playerLisa],
        moves: [],
        result: undefined,
      };

      const playerPelleMove: PlayerMove = { player: playerPelle, move: Move.Scissors };
      const playerLisaMove: PlayerMove = { player: playerLisa, move: Move.Scissors };

      const expected: GameFinishedAsDraw = {
        id,
        state: State.Finished,
        players: [playerPelle, playerLisa],
        moves: [playerPelleMove, playerLisaMove],
        result: {
          outcome: Outcome.Draw,
          winner: undefined,
        },
      };

      expect(makeMove(makeMove(game, playerPelleMove), playerLisaMove)).to.equal(expected);
    });

    it(`should return a game with state ${State.Finished}, outcome ${Outcome.Winner} and correct winner when playing ${Move.Rock} vs ${Move.Scissors}`, () => {
      const game: GameWaitingForFirstMove = {
        id,
        state: State.WaitingForFirstMove,
        players: [playerPelle, playerLisa],
        moves: [],
        result: undefined,
      };

      const playerPelleMove: PlayerMove = { player: playerPelle, move: Move.Rock };
      const playerLisaMove: PlayerMove = { player: playerLisa, move: Move.Scissors };

      const expected: GameFinishedWithWinner = {
        id,
        state: State.Finished,
        players: [playerPelle, playerLisa],
        moves: [playerPelleMove, playerLisaMove],
        result: {
          outcome: Outcome.Winner,
          winner: playerPelle,
        },
      };

      expect(makeMove(makeMove(game, playerPelleMove), playerLisaMove)).to.equal(expected);
    });

    it(`should return a game with state ${State.Finished}, outcome ${Outcome.Winner} and correct winner when playing ${Move.Rock} vs ${Move.Paper}`, () => {
      const game: GameWaitingForFirstMove = {
        id,
        state: State.WaitingForFirstMove,
        players: [playerPelle, playerLisa],
        moves: [],
        result: undefined,
      };

      const playerPelleMove: PlayerMove = { player: playerPelle, move: Move.Rock };
      const playerLisaMove: PlayerMove = { player: playerLisa, move: Move.Paper };

      const expected: GameFinishedWithWinner = {
        id,
        state: State.Finished,
        players: [playerPelle, playerLisa],
        moves: [playerPelleMove, playerLisaMove],
        result: {
          outcome: Outcome.Winner,
          winner: playerLisa,
        },
      };

      expect(makeMove(makeMove(game, playerPelleMove), playerLisaMove)).to.equal(expected);
    });

    it(`should return a game with state ${State.Finished}, outcome ${Outcome.Winner} and correct winner when playing ${Move.Paper} vs ${Move.Rock}`, () => {
      const game: GameWaitingForFirstMove = {
        id,
        state: State.WaitingForFirstMove,
        players: [playerPelle, playerLisa],
        moves: [],
        result: undefined,
      };

      const playerPelleMove: PlayerMove = { player: playerPelle, move: Move.Paper };
      const playerLisaMove: PlayerMove = { player: playerLisa, move: Move.Rock };

      const expected: GameFinishedWithWinner = {
        id,
        state: State.Finished,
        players: [playerPelle, playerLisa],
        moves: [playerPelleMove, playerLisaMove],
        result: {
          outcome: Outcome.Winner,
          winner: playerPelle,
        },
      };

      expect(makeMove(makeMove(game, playerPelleMove), playerLisaMove)).to.equal(expected);
    });

    it(`should return a game with state ${State.Finished}, outcome ${Outcome.Winner} and correct winner when playing ${Move.Paper} vs ${Move.Scissors}`, () => {
      const game: GameWaitingForFirstMove = {
        id,
        state: State.WaitingForFirstMove,
        players: [playerPelle, playerLisa],
        moves: [],
        result: undefined,
      };

      const playerPelleMove: PlayerMove = { player: playerPelle, move: Move.Paper };
      const playerLisaMove: PlayerMove = { player: playerLisa, move: Move.Scissors };

      const expected: GameFinishedWithWinner = {
        id,
        state: State.Finished,
        players: [playerPelle, playerLisa],
        moves: [playerPelleMove, playerLisaMove],
        result: {
          outcome: Outcome.Winner,
          winner: playerLisa,
        },
      };

      expect(makeMove(makeMove(game, playerPelleMove), playerLisaMove)).to.equal(expected);
    });

    it(`should return a game with state ${State.Finished}, outcome ${Outcome.Winner} and correct winner when playing ${Move.Scissors} vs ${Move.Rock}`, () => {
      const game: GameWaitingForFirstMove = {
        id,
        state: State.WaitingForFirstMove,
        players: [playerPelle, playerLisa],
        moves: [],
        result: undefined,
      };

      const playerPelleMove: PlayerMove = { player: playerPelle, move: Move.Scissors };
      const playerLisaMove: PlayerMove = { player: playerLisa, move: Move.Rock };

      const expected: GameFinishedWithWinner = {
        id,
        state: State.Finished,
        players: [playerPelle, playerLisa],
        moves: [playerPelleMove, playerLisaMove],
        result: {
          outcome: Outcome.Winner,
          winner: playerLisa,
        },
      };

      expect(makeMove(makeMove(game, playerPelleMove), playerLisaMove)).to.equal(expected);
    });

    it(`should return a game with state ${State.Finished}, outcome ${Outcome.Winner} and correct winner when playing ${Move.Scissors} vs ${Move.Paper}`, () => {
      const game: GameWaitingForFirstMove = {
        id,
        state: State.WaitingForFirstMove,
        players: [playerPelle, playerLisa],
        moves: [],
        result: undefined,
      };

      const playerPelleMove: PlayerMove = { player: playerPelle, move: Move.Scissors };
      const playerLisaMove: PlayerMove = { player: playerLisa, move: Move.Paper };

      const expected: GameFinishedWithWinner = {
        id,
        state: State.Finished,
        players: [playerPelle, playerLisa],
        moves: [playerPelleMove, playerLisaMove],
        result: {
          outcome: Outcome.Winner,
          winner: playerPelle,
        },
      };

      expect(makeMove(makeMove(game, playerPelleMove), playerLisaMove)).to.equal(expected);
    });
  });
});
