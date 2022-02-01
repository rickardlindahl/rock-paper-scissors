import * as Joi from "joi";
import { Move, Player, PlayerMove } from "../types/game";

const playerNameSchema = Joi.string().min(1).max(255).required();
const moveSchema = Joi.string().valid(Move.Rock, Move.Paper, Move.Scissors).required();

export const validatePlayer = Joi.object<Player>({
  name: playerNameSchema,
});

export const validatePlayerMove = Joi.object<PlayerMove>({
  player: {
    name: playerNameSchema,
  },
  move: moveSchema,
});
