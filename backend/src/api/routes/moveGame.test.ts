import { expect } from "@hapi/code";
import type { Server } from "@hapi/hapi";
import * as Lab from "@hapi/lab";
import { HttpMethod } from "../../types/http";
import { init } from "../server";
import { moveGamePath } from "./moveGame";

const lab = Lab.script();
const { beforeEach, afterEach, describe, it } = lab;
export { lab };

describe("Move Game endpoint", () => {
  let server: Server;

  beforeEach(async () => {
    server = await init();
  });

  afterEach(async () => {
    await server.stop();
  });

  describe(HttpMethod.Post, () => {
    it("responds with 501", async () => {
      const res = await server.inject({
        method: HttpMethod.Post,
        url: moveGamePath,
      });
      expect(res.statusCode).to.equal(501);
    });
  });
});
