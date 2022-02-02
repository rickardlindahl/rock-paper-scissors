import { expect } from "@hapi/code";
import type { Server } from "@hapi/hapi";
import * as Lab from "@hapi/lab";
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

describe("Join Game endpoint", () => {
  const id = "123";
  const playerPelle: Player = { name: "Pelle" };
  const playerLisa: Player = { name: "Lisa" };
  const playerMovePelle: PlayerMove = { player: playerPelle, move: Move.Rock };
  const playerMoveLisa: PlayerMove = { player: playerLisa, move: Move.Paper };
  let server: Server;

  beforeEach(async () => {
    server = await init();
  });

  afterEach(async () => {
    await server.stop();
  });

  it("should respond with 404 when trying to join a game that does not exist", async () => {
    const res = await server.inject({
      method: HttpMethod.Post,
      url: "/api/games/404/join",
      payload: playerPelle,
    });

    expect(res.statusCode).to.equal(404);
  });

  it(`should respond with 403 when trying to join a game with state ${State.WaitingForFirstMove}`, async () => {
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
      url: `/api/games/${id}/join`,
      payload: playerPelle,
    });

    expect(res.result).to.equal({
      statusCode: 403,
      error: "Forbidden",
      message: "The game has already started or finished",
    });

    store.set(id, undefined);
  });

  it(`should respond with 403 when trying to join a game with state ${State.WaitingForSecondMove}`, async () => {
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
      url: `/api/games/${id}/join`,
      payload: playerLisa,
    });

    expect(res.result).to.equal({
      statusCode: 403,
      error: "Forbidden",
      message: "The game has already started or finished",
    });

    store.set(id, undefined);
  });

  it(`should respond with 403 when trying to join a game with state ${State.Finished}`, async () => {
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
      url: `/api/games/${id}/join`,
      payload: playerLisa,
    });

    expect(res.result).to.equal({
      statusCode: 403,
      error: "Forbidden",
      message: "The game has already started or finished",
    });

    store.set(id, undefined);
  });

  it(`should respond with 409 when trying to join a game with the same name as the player creating the game`, async () => {
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
      url: `/api/games/${id}/join`,
      payload: playerPelle,
    });

    expect(res.result).to.equal({
      statusCode: 409,
      error: "Conflict",
      message: "Player names must be unique",
    });

    store.set(id, undefined);
  });

  it(`should respond with 200 when successfully joining a game`, async () => {
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
      url: `/api/games/${id}/join`,
      payload: playerLisa,
    });

    const expected: GameWaitingForFirstMove = {
      id,
      state: State.WaitingForFirstMove,
      players: [playerPelle, playerLisa],
      moves: [],
      result: null,
    };

    expect(res.result).to.equal(expected);

    store.set(id, undefined);
  });
});
