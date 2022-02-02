import { expect } from "@hapi/code";
import * as Lab from "@hapi/lab";
import { createGame, joinGame, makeMove } from "./game";
import { GameWaitingForFirstMove, GameWaitingForPlayerToJoin, Move, Player, State } from "./types/game";

const lab = Lab.script();
const { describe, it } = lab;
export { lab };

describe("Game logic", () => {
  describe("Create game", () => {
    it("Creates a new game", () => {
      const id = "123";
      const player: Player = { name: "Rickard" };

      const expected: GameWaitingForPlayerToJoin = {
        id,
        state: State.WaitingForPlayerToJoin,
        players: [player],
        moves: [],
        result: undefined,
      };

      expect(createGame(id, player)).to.equal(expected);
    });
  });

  describe("Join game", () => {
    it(`returns a game with state = ${State.WaitingForFirstMove} when joining a new game`, () => {
      const id = "123";
      const player1: Player = { name: "Rickard" };
      const game = createGame(id, player1);

      const player2: Player = { name: "Lindahl" };

      const expected: GameWaitingForFirstMove = {
        id,
        state: State.WaitingForFirstMove,
        players: [player1, player2],
        moves: [],
        result: undefined,
      };

      expect(joinGame(game, player2)).to.equal(expected);
    });

    it("throws an error when trying to join a new game and player names are equal", () => {
      const id = "123";
      const player1: Player = { name: "Rickard" };
      const game = createGame(id, player1);

      const player2: Player = { name: "Rickard" };

      expect(() => joinGame(game, player2)).to.throw();
    });

    it(`throws an error when trying to join a game that is in state ${State.WaitingForFirstMove}`, () => {
      const id = "123";
      const player1: Player = { name: "Rickard" };
      const player2: Player = { name: "Lindahl" };
      const game = joinGame(createGame(id, player1), player2);

      expect(game.state).to.equal(State.WaitingForFirstMove);

      expect(() => joinGame(game, player2)).to.throw();
    });

    it(`throws an error when trying to join a game that is in state ${State.WaitingForSecondMove}`, () => {
      const id = "123";
      const player1: Player = { name: "Rickard" };
      const player2: Player = { name: "Lindahl" };
      const game = makeMove(joinGame(createGame(id, player1), player2), { player: player1, move: Move.Rock });

      expect(game.state).to.equal(State.WaitingForSecondMove);

      expect(() => joinGame(game, player2)).to.throw();
    });

    it(`throws an error when trying to join a game that is in state ${State.Finished}`, () => {
      const id = "123";
      const player1: Player = { name: "Rickard" };
      const player2: Player = { name: "Lindahl" };
      const game = makeMove(
        makeMove(joinGame(createGame(id, player1), player2), { player: player1, move: Move.Rock }),
        { player: player2, move: Move.Paper },
      );

      expect(game.state).to.equal(State.Finished);

      expect(() => joinGame(game, player2)).to.throw();
    });
  });
});
