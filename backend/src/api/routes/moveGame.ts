import * as Boom from "@hapi/boom";
import * as Hapi from "@hapi/hapi";
import { firstMove, secondMove } from "../../game";
import { store } from "../../store";
import { PlayerMove, State } from "../../types/game";
import { HapiRequest } from "../../types/hapi";
import { HttpMethod } from "../../types/http";

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

    if (game.state === State.Finished) {
      return Boom.forbidden("Move not allowed! Game is already finished.");
    }

    if (game.state === State.WaitingForPlayerToJoin) {
      return Boom.forbidden("Move not allowed! Waiting for opponent to join.");
    }

    if (game.state === State.WaitingForFirstMove) {
      store.set(game.id, firstMove(game, playerMove));

      return responseToolkit.response().code(200);
    }

    const finalGameState = secondMove(game, playerMove);

    store.set(game.id, finalGameState);

    return responseToolkit.response().code(200);
  },
};
