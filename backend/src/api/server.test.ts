import { expect } from "@hapi/code";
import type { Server } from "@hapi/hapi";
import * as Lab from "@hapi/lab";
import { HttpMethod } from "../types/http";
import { ApiPath, init } from "./server";

const { afterEach, beforeEach, describe, it } = (exports.lab = Lab.script());

describe("Rock Paper Scissors API", () => {
  let server: Server;

  beforeEach(async () => {
    server = await init();
  });

  afterEach(async () => {
    await server.stop();
  });

  const assertRouteNotFound = (path: string, httpMethod: HttpMethod) => {
    describe(httpMethod, () => {
      it("responds with 404", async () => {
        const res = await server.inject({
          method: httpMethod,
          url: path,
        });
        expect(res.statusCode).to.equal(404);
      });
    });
  };

  describe(`${ApiPath.Games} endpoint`, () => {
    [HttpMethod.Delete, HttpMethod.Get, HttpMethod.Options, HttpMethod.Patch, HttpMethod.Put].map(httpMethod => {
      assertRouteNotFound(ApiPath.Games, httpMethod);
    });

    describe(HttpMethod.Post, () => {
      it("responds with 501", async () => {
        const res = await server.inject({
          method: HttpMethod.Post,
          url: ApiPath.Games,
        });
        expect(res.statusCode).to.equal(501);
      });
    });
  });

  describe(`${ApiPath.GameWithId} endpoint`, () => {
    [HttpMethod.Delete, HttpMethod.Options, HttpMethod.Patch, HttpMethod.Put, HttpMethod.Post].map(httpMethod => {
      assertRouteNotFound(ApiPath.GameWithId, httpMethod);
    });

    describe(HttpMethod.Get, () => {
      it("responds with 501", async () => {
        const res = await server.inject({
          method: HttpMethod.Get,
          url: ApiPath.GameWithId,
        });
        expect(res.statusCode).to.equal(501);
      });
    });
  });

  describe(`${ApiPath.JoinGameWithId} endpoint`, () => {
    [HttpMethod.Delete, HttpMethod.Get, HttpMethod.Options, HttpMethod.Patch, HttpMethod.Put].map(httpMethod => {
      assertRouteNotFound(ApiPath.JoinGameWithId, httpMethod);
    });

    describe(HttpMethod.Post, () => {
      it("responds with 501", async () => {
        const res = await server.inject({
          method: HttpMethod.Post,
          url: ApiPath.JoinGameWithId,
        });
        expect(res.statusCode).to.equal(501);
      });
    });
  });

  describe(`${ApiPath.MoveGameWithId} endpoint`, () => {
    [HttpMethod.Delete, HttpMethod.Get, HttpMethod.Options, HttpMethod.Patch, HttpMethod.Put].map(httpMethod => {
      assertRouteNotFound(ApiPath.MoveGameWithId, httpMethod);
    });

    describe(HttpMethod.Post, () => {
      it("responds with 501", async () => {
        const res = await server.inject({
          method: HttpMethod.Post,
          url: ApiPath.MoveGameWithId,
        });
        expect(res.statusCode).to.equal(501);
      });
    });
  });
});
