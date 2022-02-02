import { expect } from "@hapi/code";
import type { Server } from "@hapi/hapi";
import * as Lab from "@hapi/lab";
import { getPublicViewModel } from "../../game";
import { store } from "../../store";
import {
  GameFinishedWithWinner,
  GameWaitingForFirstMove,
  GameWaitingForPlayerToJoin,
  GameWaitingForSecondMove,
  Move,
  Outcome,
  Player,
  PlayerMove,
  State,
} from "../../types/game";
import { HttpMethod } from "../../types/http";
import { init } from "../server";

const lab = Lab.script();
const { beforeEach, afterEach, describe, it } = lab;
export { lab };

describe("Move Game endpoint", () => {
  const id = "123";
  const playerPelle: Player = { name: "Pelle" };
  const playerLisa: Player = { name: "Lisa" };
  const playerHacker: Player = { name: "Hacker" };
  const playerMovePelle: PlayerMove = { ...playerPelle, move: Move.Rock };
  const playerMoveLisa: PlayerMove = { ...playerLisa, move: Move.Paper };
  const playerMoveHacker: PlayerMove = { ...playerHacker, move: Move.Scissors };
  let server: Server;

  beforeEach(async () => {
    server = await init();
  });

  afterEach(async () => {
    await server.stop();
  });

  it("should respond with 404 when trying to make a move on a game that does not exist", async () => {
    const res = await server.inject({
      method: HttpMethod.Post,
      url: "/api/games/404/move",
      payload: playerMovePelle,
    });

    expect(res.statusCode).to.equal(404);
  });

  it(`should respond with 403 when trying to make a move on a game with state ${State.WaitingForPlayerToJoin}`, async () => {
    const game: GameWaitingForPlayerToJoin = {
      id,
      state: State.WaitingForPlayerToJoin,
      players: [playerPelle],
      moves: [],
      result: null,
    };

    store.set(id, game);

    const res = await server.inject({
      method: HttpMethod.Post,
      url: `/api/games/${id}/move`,
      payload: playerMovePelle,
    });

    expect(res.result).to.equal({
      statusCode: 403,
      error: "Forbidden",
      message: "The game does not accept any moves at this moment",
    });

    store.set(id, undefined);
  });

  it(`should respond with 403 when trying to make a move on a game with state ${State.Finished}`, async () => {
    const game: GameFinishedWithWinner = {
      id,
      state: State.Finished,
      players: [playerPelle, playerLisa],
      moves: [playerMovePelle, playerMoveLisa],
      result: {
        outcome: Outcome.Winner,
        winner: playerLisa,
      },
    };

    store.set(id, game);

    const res = await server.inject({
      method: HttpMethod.Post,
      url: `/api/games/${id}/move`,
      payload: playerMovePelle,
    });

    expect(res.result).to.equal({
      statusCode: 403,
      error: "Forbidden",
      message: "The game does not accept any moves at this moment",
    });

    store.set(id, undefined);
  });

  it(`should respond with 403 when trying to make a move with a player that is not a part of the game with state ${State.WaitingForFirstMove}`, async () => {
    const game: GameWaitingForFirstMove = {
      id,
      state: State.WaitingForFirstMove,
      players: [playerPelle, playerLisa],
      moves: [],
      result: null,
    };

    store.set(id, game);

    const res = await server.inject({
      method: HttpMethod.Post,
      url: `/api/games/${id}/move`,
      payload: playerMoveHacker,
    });

    expect(res.result).to.equal({
      statusCode: 403,
      error: "Forbidden",
      message: "The player making the move is not part of this game",
    });

    store.set(id, undefined);
  });

  it(`should respond with 403 when trying to make a move with a player that is not a part of the game with state ${State.WaitingForSecondMove}`, async () => {
    const game: GameWaitingForSecondMove = {
      id,
      state: State.WaitingForSecondMove,
      players: [playerPelle, playerLisa],
      moves: [playerMovePelle],
      result: null,
    };

    store.set(id, game);

    const res = await server.inject({
      method: HttpMethod.Post,
      url: `/api/games/${id}/move`,
      payload: playerMoveHacker,
    });

    expect(res.result).to.equal({
      statusCode: 403,
      error: "Forbidden",
      message: "The player making the move is not part of this game",
    });

    store.set(id, undefined);
  });

  it(`should respond with 403 when trying to make a move with a player that has already made a move`, async () => {
    const game: GameWaitingForSecondMove = {
      id,
      state: State.WaitingForSecondMove,
      players: [playerPelle, playerLisa],
      moves: [playerMovePelle],
      result: null,
    };

    store.set(id, game);

    const res = await server.inject({
      method: HttpMethod.Post,
      url: `/api/games/${id}/move`,
      payload: playerMovePelle,
    });

    expect(res.result).to.equal({
      statusCode: 403,
      error: "Forbidden",
      message: "The player making the move has already made a move",
    });

    store.set(id, undefined);
  });

  it(`should respond with 200 and the public view model when making a move on a game with state ${State.WaitingForFirstMove}`, async () => {
    const game: GameWaitingForFirstMove = {
      id,
      state: State.WaitingForFirstMove,
      players: [playerPelle, playerLisa],
      moves: [],
      result: null,
    };

    store.set(id, game);

    const res = await server.inject({
      method: HttpMethod.Post,
      url: `/api/games/${id}/move`,
      payload: playerMovePelle,
    });

    const expected: GameWaitingForSecondMove = {
      ...game,
      state: State.WaitingForSecondMove,
      moves: [playerMovePelle],
    };

    expect(res.result).to.equal(getPublicViewModel(expected));

    store.set(id, undefined);
  });

  it(`should respond with 200 and the public view model when making a move on a game with state ${State.WaitingForSecondMove}`, async () => {
    const game: GameWaitingForSecondMove = {
      id,
      state: State.WaitingForSecondMove,
      players: [playerPelle, playerLisa],
      moves: [playerMovePelle],
      result: null,
    };

    store.set(id, game);

    const res = await server.inject({
      method: HttpMethod.Post,
      url: `/api/games/${id}/move`,
      payload: playerMoveLisa,
    });

    const expected: GameFinishedWithWinner = {
      ...game,
      state: State.Finished,
      moves: [playerMovePelle, playerMoveLisa],
      result: {
        outcome: Outcome.Winner,
        winner: playerLisa,
      },
    };

    expect(res.result).to.equal(getPublicViewModel(expected));

    store.set(id, undefined);
  });
});
