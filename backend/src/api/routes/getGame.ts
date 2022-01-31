import * as Boom from "@hapi/boom";
import * as Hapi from "@hapi/hapi";
import { HttpMethod } from "../../types/http";

export const getGamePath = "/api/games/{id}";

export const getGameRoute: Hapi.ServerRoute = {
  method: HttpMethod.Get,
  path: getGamePath,
  handler: () => {
    return Boom.notImplemented("method not implemented");
  },
};
