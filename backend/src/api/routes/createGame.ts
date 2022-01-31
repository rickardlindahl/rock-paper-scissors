import * as Boom from "@hapi/boom";
import * as Hapi from "@hapi/hapi";
import { HttpMethod } from "../../types/http";

export const createGamePath = "/api/games";

export const createGameRoute: Hapi.ServerRoute = {
  method: HttpMethod.Post,
  path: createGamePath,
  handler: () => {
    return Boom.notImplemented("method not implemented");
  },
};
