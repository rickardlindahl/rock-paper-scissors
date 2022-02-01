import * as Hapi from "@hapi/hapi";
import { v4 as uuidv4 } from "uuid";
import { createGame } from "../../game";
import { store } from "../../store";
import { Player } from "../../types/game";
import { HapiRequest } from "../../types/hapi";
import { HttpMethod } from "../../types/http";
import { validatePlayer } from "../validation";

export const createGamePath = "/api/games";

export const createGameRoute: Hapi.ServerRoute = {
  method: HttpMethod.Post,
  path: createGamePath,
  handler: (req: HapiRequest<Player>) => {
    const player = req.payload;

    const game = createGame(uuidv4(), player);

    store.set(game.id, game);

    return {
      id: game.id,
    };
  },
  options: {
    validate: {
      payload: validatePlayer,
    },
  },
};
