import * as Boom from "@hapi/boom";
import * as Hapi from "@hapi/hapi";
import { MoveForbiddenError } from "../../errors/MoveForbiddenError";
import { makeMove } from "../../game";
import { store } from "../../store";
import { PlayerMove } from "../../types/game";
import { HapiRequest } from "../../types/hapi";
import { HttpMethod } from "../../types/http";
import { validatePlayerMove } from "../validation";

export const moveGamePath = "/api/games/{id}/move";

export const moveGameRoute: Hapi.ServerRoute = {
  method: HttpMethod.Post,
  path: moveGamePath,
  handler: (req: HapiRequest<PlayerMove>, responseToolkit) => {
    const playerMove = req.payload;
    const gameId = req.params.id;

    const game = store.get(gameId);

    if (!game) {
      return Boom.notFound("Game does not exist");
    }

    try {
      const nextState = makeMove(game, playerMove);

      store.set(game.id, nextState);

      return responseToolkit.response().code(200);
    } catch (e: unknown) {
      if (e instanceof MoveForbiddenError) {
        throw Boom.forbidden("Unable to make move", e);
      }

      throw Boom.badImplementation("Failed to make move", e);
    }
  },
  options: {
    validate: {
      payload: validatePlayerMove,
    },
  },
};
