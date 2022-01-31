import * as Hapi from "@hapi/hapi";
import * as Boom from "@hapi/boom";
import { HttpMethod } from "../../types/http";

export const moveGamePath = "/api/games/{id}/move";

export const moveGameRoute: Hapi.ServerRoute = {
  method: HttpMethod.Post,
  path: moveGamePath,
  handler: () => {
    return Boom.notImplemented("method not implemented");
  },
};
