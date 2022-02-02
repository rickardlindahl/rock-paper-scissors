import * as Boom from "@hapi/boom";
import * as Hapi from "@hapi/hapi";
import { GameNotJoinableError } from "../../errors/GameNotJoinableError";
import { PlayerNameConflictError } from "../../errors/PlayerNameConflictError";
import { getPublicViewModel, joinGame } from "../../game";
import { store } from "../../store";
import { Player } from "../../types/game";
import { HapiRequest } from "../../types/hapi";
import { HttpMethod } from "../../types/http";
import { validatePlayer } from "../validation";

export const joinGameRoute: Hapi.ServerRoute = {
  method: HttpMethod.Post,
  path: "/api/games/{id}/join",
  handler: (req: HapiRequest<Player, { id: string }>) => {
    const player = req.payload;
    const gameId = req.params.id;

    const game = store.get(gameId);

    if (!game) {
      return Boom.notFound("Game does not exist");
    }

    try {
      const nextState = joinGame(game, player);

      store.set(game.id, nextState);

      return getPublicViewModel(nextState);
    } catch (e: unknown) {
      if (e instanceof GameNotJoinableError) {
        throw Boom.forbidden(e.message, e);
      }

      if (e instanceof PlayerNameConflictError) {
        throw Boom.conflict(e.message, e);
      }

      throw Boom.badImplementation("Failed to join game", e);
    }
  },
  options: {
    validate: {
      payload: validatePlayer,
    },
  },
};
