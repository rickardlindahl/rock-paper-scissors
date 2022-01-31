import * as Boom from "@hapi/boom";
import * as Hapi from "@hapi/hapi";
import { HttpMethod } from "../types/http";

export enum ApiPath {
  Games = "/api/games",
  GamesId = "/api/games/{id}",
  GamesIdJoin = "/api/games/{id}/join",
  GamesIdMove = "/api/games/{id}/move",
}

export const init = async () => {
  const server = Hapi.server({
    port: 3000,
    host: "localhost",
  });

  server.route({
    method: HttpMethod.Post,
    path: ApiPath.GamesIdJoin,
    handler: () => {
      return Boom.notImplemented("method not implemented");
    },
  });

  server.route({
    method: HttpMethod.Post,
    path: ApiPath.GamesIdMove,
    handler: () => {
      return Boom.notImplemented("method not implemented");
    },
  });

  server.route({
    method: HttpMethod.Get,
    path: ApiPath.GamesId,
    handler: () => {
      return Boom.notImplemented("method not implemented");
    },
  });

  server.route({
    method: HttpMethod.Post,
    path: ApiPath.Games,
    handler: () => {
      return Boom.notImplemented("method not implemented");
    },
  });

  await server.initialize();

  return server;
};
