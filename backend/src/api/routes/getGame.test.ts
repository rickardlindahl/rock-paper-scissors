import { expect } from "@hapi/code";
import type { Server } from "@hapi/hapi";
import * as Lab from "@hapi/lab";
import { getPublicViewModel } from "../../game";
import { store } from "../../store";
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
} from "../../types/game";
import { HttpMethod } from "../../types/http";
import { init } from "../server";

const lab = Lab.script();
const { beforeEach, afterEach, describe, it } = lab;
export { lab };

describe("Get Game endpoint", () => {
  const id = "123";
  const playerPelle: Player = { name: "Pelle" };
  const playerLisa: Player = { name: "Lisa" };
  const playerMovePelle: PlayerMove = {
    player: playerPelle,
    move: Move.Rock,
  };
  const playerMoveLisa: PlayerMove = {
    player: playerLisa,
    move: Move.Paper,
  };

  let server: Server;

  beforeEach(async () => {
    server = await init();
  });

  afterEach(async () => {
    await server.stop();
  });

  it("should respond with 404 when a game with the given id does not exist", async () => {
    const res = await server.inject({
      method: HttpMethod.Get,
      url: "/api/games/404",
    });
    expect(res.statusCode).to.equal(404);
  });

  it(`should respond with 200 and the public view model when a game with the given id exists - ${State.WaitingForPlayerToJoin}`, async () => {
    const game: GameWaitingForPlayerToJoin = {
      id,
      state: State.WaitingForPlayerToJoin,
      players: [playerPelle],
      moves: [],
      result: null,
    };

    store.set(id, game);

    const res = await server.inject({
      method: HttpMethod.Get,
      url: `/api/games/${id}`,
    });

    expect(res.statusCode).to.equal(200);
    expect(JSON.parse(res.payload)).to.equal(getPublicViewModel(game));

    store.set(id, undefined);
  });

  it(`should respond with 200 and the public view model when a game with the given id exists - ${State.WaitingForFirstMove}`, async () => {
    const game: GameWaitingForFirstMove = {
      id,
      state: State.WaitingForFirstMove,
      players: [playerPelle, playerLisa],
      moves: [],
      result: null,
    };

    store.set(id, game);

    const res = await server.inject({
      method: HttpMethod.Get,
      url: `/api/games/${id}`,
    });

    expect(res.statusCode).to.equal(200);
    expect(JSON.parse(res.payload)).to.equal(getPublicViewModel(game));

    store.set(id, undefined);
  });

  it(`should respond with 200 and the public view model when a game with the given id exists - ${State.WaitingForSecondMove}`, async () => {
    const game: GameWaitingForSecondMove = {
      id,
      state: State.WaitingForSecondMove,
      players: [playerPelle, playerLisa],
      moves: [playerMoveLisa],
      result: null,
    };

    store.set(id, game);

    const res = await server.inject({
      method: HttpMethod.Get,
      url: `/api/games/${id}`,
    });

    expect(res.statusCode).to.equal(200);
    expect(JSON.parse(res.payload)).to.equal(getPublicViewModel(game));

    store.set(id, undefined);
  });

  it(`should respond with 200 and the public view model when a game with the given id exists - ${State.Finished} and outcome ${Outcome.Draw}`, async () => {
    const game: GameFinishedAsDraw = {
      id,
      state: State.Finished,
      players: [playerPelle, playerLisa],
      moves: [playerMoveLisa, playerMovePelle],
      result: {
        outcome: Outcome.Draw,
        winner: null,
      },
    };

    store.set(id, game);

    const res = await server.inject({
      method: HttpMethod.Get,
      url: `/api/games/${id}`,
    });

    expect(res.statusCode).to.equal(200);
    expect(JSON.parse(res.payload)).to.equal(getPublicViewModel(game));

    store.set(id, undefined);
  });

  it(`should respond with 200 and the public view model when a game with the given id exists - ${State.Finished} and outcome ${Outcome.Winner}`, async () => {
    const game: GameFinishedWithWinner = {
      id,
      state: State.Finished,
      players: [playerPelle, playerLisa],
      moves: [playerMoveLisa, playerMovePelle],
      result: {
        outcome: Outcome.Winner,
        winner: playerLisa,
      },
    };

    store.set(id, game);

    const res = await server.inject({
      method: HttpMethod.Get,
      url: `/api/games/${id}`,
    });

    expect(res.statusCode).to.equal(200);
    expect(JSON.parse(res.payload)).to.equal(getPublicViewModel(game));

    store.set(id, undefined);
  });
});
