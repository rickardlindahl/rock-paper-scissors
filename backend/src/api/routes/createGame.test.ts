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
    describe(`${httpMethod} method`, () => {
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

  describe(`${HttpMethod.Post} method`, () => {
    describe("Without a payload", () => {
      it("responds with 400", async () => {
        const res = await server.inject({
          method: HttpMethod.Post,
          url: createGamePath,
          payload: undefined,
        });
        expect(res.result).to.equal({
          statusCode: 400,
          error: "Bad Request",
          message: "Invalid request payload input",
        });
      });
    });

    describe("Non-JSON payload", () => {
      it("responds with 400", async () => {
        const res = await server.inject({
          method: HttpMethod.Post,
          url: createGamePath,
          payload: "Not JSON",
        });
        expect(res.result).to.equal({
          statusCode: 400,
          error: "Bad Request",
          message: "Invalid request payload JSON format",
        });
      });
    });

    describe("Valid JSON without a name property", () => {
      it("responds with 400", async () => {
        const res = await server.inject({
          method: HttpMethod.Post,
          url: createGamePath,
          payload: {
            foo: "bar",
          },
        });
        expect(res.result).to.equal({
          statusCode: 400,
          error: "Bad Request",
          message: "Invalid request payload input",
        });
      });
    });

    describe("Valid JSON with an empty name", () => {
      it("responds with 400", async () => {
        const res = await server.inject({
          method: HttpMethod.Post,
          url: createGamePath,
          payload: {
            name: "",
          },
        });
        expect(res.result).to.equal({
          statusCode: 400,
          error: "Bad Request",
          message: "Invalid request payload input",
        });
      });
    });

    describe("Valid JSON with too long name", () => {
      it(" responds with 400", async () => {
        const res = await server.inject({
          method: HttpMethod.Post,
          url: createGamePath,
          payload: {
            name: new Array(255 + 1).join("a"),
          },
        });

        expect(res.statusCode).to.equal(200);
        expect(res.payload).to.be.a.string();
      });
    });
  });
});
