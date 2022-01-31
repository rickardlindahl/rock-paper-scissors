import * as Hapi from "@hapi/hapi";
import * as Boom from "@hapi/boom";
import { HttpMethod } from "../../types/http";

export const joinGamePath = "/api/games/{id}/join";

export const joinGameRoute: Hapi.ServerRoute = {
  method: HttpMethod.Post,
  path: joinGamePath,
  handler: () => {
    return Boom.notImplemented("method not implemented");
  },
};
