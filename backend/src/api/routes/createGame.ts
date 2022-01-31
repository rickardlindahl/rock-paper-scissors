import * as Hapi from "@hapi/hapi";
import * as Joi from "joi";
import { v4 as uuidv4 } from "uuid";
import { CreateGameResponse, Player } from "../../types/game";
import { HttpMethod } from "../../types/http";

export const createGamePath = "/api/games";

export const createGameRoute: Hapi.ServerRoute = {
  method: HttpMethod.Post,
  path: createGamePath,
  handler: () => {
    const response: CreateGameResponse = {
      id: uuidv4(),
    };

    return response;
  },
  options: {
    validate: {
      payload: Joi.object<Player>({
        name: Joi.string().min(1).max(255).required(),
      }),
    },
  },
};
