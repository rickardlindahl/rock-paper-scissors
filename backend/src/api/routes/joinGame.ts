import * as Boom from "@hapi/boom";
import * as Hapi from "@hapi/hapi";
import { joinGame } from "../../game";
import { store } from "../../store";
import { Player, State } from "../../types/game";
import { HapiRequest } from "../../types/hapi";
import { HttpMethod } from "../../types/http";

export const joinGamePath = "/api/games/{id}/join";

export const joinGameRoute: Hapi.ServerRoute = {
  method: HttpMethod.Post,
  path: joinGamePath,
  handler: (req: HapiRequest<Player>) => {
    const player = req.payload;
    const gameId = req.params.id;

    const game = store.get(gameId);

    if (!game) {
      return Boom.notFound("Game does not exist");
    }

    if (game.state !== State.WaitingForPlayerToJoin) {
      return Boom.forbidden("Game is not joinable");
    }

    const nextState = joinGame(game, player);

    store.set(game.id, nextState);

    return nextState;
  },
};
