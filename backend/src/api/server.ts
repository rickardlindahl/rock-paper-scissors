import * as Hapi from "@hapi/hapi";

export const init = async () => {
  const server = Hapi.server({
    port: 3000,
    host: "localhost",
  });

  await server.initialize();

  return server;
};
