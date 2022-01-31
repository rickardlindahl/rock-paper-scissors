import * as Hapi from "@hapi/hapi";
import { createGameRoute } from "./routes/createGame";
import { getGameRoute } from "./routes/getGame";
import { joinGameRoute } from "./routes/joinGame";
import { moveGameRoute } from "./routes/moveGame";

export const init = async () => {
  const server = Hapi.server({
    port: 3000,
    host: "localhost",
  });

  server.route(joinGameRoute);

  server.route(moveGameRoute);

  server.route(getGameRoute);

  server.route(createGameRoute);

  await server.initialize();

  return server;
};
