import { expect } from "@hapi/code";
import type { Server } from "@hapi/hapi";
import * as Lab from "@hapi/lab";
import { store } from "../../store";
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

  it("should respond with 400 when posting without a payload", async () => {
    const res = await server.inject({
      method: HttpMethod.Post,
      url: "/api/games",
    });

    expect(res.result).to.equal({
      statusCode: 400,
      error: "Bad Request",
      message: "Invalid request payload input",
    });
  });

  it("should respond with 400 when posting with invalid JSON payload", async () => {
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

  it("should respond with 400 when posting with valid JSON without a name property", async () => {
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

  it("should respond with 400 when posting with valid JSON with an empty name", async () => {
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

  it("should respond with 400 when posting with valid JSON with too long name", async () => {
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

  it("should respond with 200 and a game id when posting with a valid payload", async () => {
    const res = await server.inject({
      method: HttpMethod.Post,
      url: "/api/games",
      payload: {
        name: "Pelle",
      },
    });

    expect(res.statusCode).to.equal(200);

    const { id } = JSON.parse(res.payload) as { id: string };
    expect(id).to.match(/[0-9a-f]{8}-[0-9a-f]{4}-[0-5][0-9a-f]{3}-[089ab][0-9a-f]{3}-[0-9a-f]{12}/);

    store.set(id, undefined);
  });
});
