import { expect } from "@hapi/code";
import type { Server } from "@hapi/hapi";
import * as Lab from "@hapi/lab";
import { HttpMethod } from "../../types/http";
import { init } from "../server";
import { getGamePath } from "./getGame";

const lab = Lab.script();
const { beforeEach, afterEach, describe, it } = lab;
export { lab };

describe("Get Game endpoint", () => {
  let server: Server;

  beforeEach(async () => {
    server = await init();
  });

  afterEach(async () => {
    await server.stop();
  });

  describe(HttpMethod.Get, () => {
    it("responds with 501", async () => {
      const res = await server.inject({
        method: HttpMethod.Get,
        url: getGamePath,
      });
      expect(res.statusCode).to.equal(501);
    });
  });
});
