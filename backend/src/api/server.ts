import * as Boom from "@hapi/boom";
import * as Hapi from "@hapi/hapi";
import { HttpMethod } from "../types/http";

export enum ApiPath {
  Games = "/api/games",
  GameWithId = "/api/games/{id}",
  JoinGameWithId = "/api/games/{id}/join",
  MoveGameWithId = "/api/games/{id}/move",
}

export const init = async () => {
  const server = Hapi.server({
    port: 3000,
    host: "localhost",
  });

  server.route({
    method: HttpMethod.Post,
    path: ApiPath.JoinGameWithId,
    handler: () => {
      return Boom.notImplemented("method not implemented");
    },
  });

  server.route({
    method: HttpMethod.Post,
    path: ApiPath.MoveGameWithId,
    handler: () => {
      return Boom.notImplemented("method not implemented");
    },
  });

  server.route({
    method: HttpMethod.Get,
    path: ApiPath.GameWithId,
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
