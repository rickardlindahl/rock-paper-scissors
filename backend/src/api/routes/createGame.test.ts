import { expect } from "@hapi/code";
import type { Server } from "@hapi/hapi";
import * as Lab from "@hapi/lab";
import { HttpMethod } from "../../types/http";
import { init } from "../server";

const lab = Lab.script();
const { beforeEach, afterEach, describe, it } = lab;
export { lab };

describe("Create Game endpoint", () => {
  let server: Server;

  beforeEach(async () => {
    server = await init();
  });

  afterEach(async () => {
    await server.stop();
  });

  describe("POSTing without a payload", () => {
    it("should respond with 400", async () => {
      const res = await server.inject({
        method: HttpMethod.Post,
        url: "/api/games",
        payload: undefined,
      });

      expect(res.result).to.equal({
        statusCode: 400,
        error: "Bad Request",
        message: "Invalid request payload input",
      });
    });
  });

  describe("POSTing with a non-JSON payload", () => {
    it("should respond with 400", async () => {
      const res = await server.inject({
        method: HttpMethod.Post,
        url: "/api/games",
        payload: "Not JSON",
      });

      expect(res.result).to.equal({
        statusCode: 400,
        error: "Bad Request",
        message: "Invalid request payload JSON format",
      });
    });
  });

  describe("POSTing with valid JSON without a name property", () => {
    it("should respond with 400", async () => {
      const res = await server.inject({
        method: HttpMethod.Post,
        url: "/api/games",
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
    it("should respond with 400", async () => {
      const res = await server.inject({
        method: HttpMethod.Post,
        url: "/api/games",
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
    it("should respond with 400", async () => {
      const res = await server.inject({
        method: HttpMethod.Post,
        url: "/api/games",
        payload: {
          name: new Array(512).join("a"),
        },
      });

      expect(res.result).to.equal({
        statusCode: 400,
        error: "Bad Request",
        message: "Invalid request payload input",
      });
    });
  });

  describe("Valid payload", () => {
    it("should respond with 200 and a game id", async () => {
      const res = await server.inject({
        method: HttpMethod.Post,
        url: "/api/games",
        payload: {
          name: "Pelle",
        },
      });

      expect(res.statusCode).to.equal(200);

      const response = JSON.parse(res.payload);
      expect(response.id).to.match(/[0-9a-f]{8}-[0-9a-f]{4}-[0-5][0-9a-f]{3}-[089ab][0-9a-f]{3}-[0-9a-f]{12}/);
    });
  });
});
