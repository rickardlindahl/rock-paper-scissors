import { expect } from "@hapi/code";
import type { Server } from "@hapi/hapi";
import * as Lab from "@hapi/lab";
import { HttpMethod } from "../../types/http";
import { init } from "../server";
import { createGamePath } from "./createGame";

const { afterEach, beforeEach, describe, it } = (exports.lab = Lab.script());

describe("Create Game endpoint", () => {
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

  [HttpMethod.Delete, HttpMethod.Get, HttpMethod.Options, HttpMethod.Patch, HttpMethod.Put].map(httpMethod => {
    assertRouteNotFound(createGamePath, httpMethod);
  });

  describe(HttpMethod.Post, () => {
    it("responds with 501", async () => {
      const res = await server.inject({
        method: HttpMethod.Post,
        url: createGamePath,
      });
      expect(res.statusCode).to.equal(501);
    });
  });
});
