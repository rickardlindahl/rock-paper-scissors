import * as Boom from "@hapi/boom";
import * as Hapi from "@hapi/hapi";
import { getPublicViewModel } from "../../game";
import { store } from "../../store";
import { HapiRequest } from "../../types/hapi";
import { HttpMethod } from "../../types/http";

export const getGamePath = "/api/games/{id}";

export const getGameRoute: Hapi.ServerRoute = {
  method: HttpMethod.Get,
  path: getGamePath,
  handler: (req: HapiRequest<undefined, { "id": string }>) => {
    const gameId = req.params.id;

    const game = store.get(gameId);

    if (!game) {
      return Boom.notFound("Game does not exist");
    }

    return getPublicViewModel(game);
  },
};
