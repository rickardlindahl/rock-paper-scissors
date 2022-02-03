import { init } from "./api/server";

const runApp = async () => {
  const server = await init();

  await server.start();
};

process.on("unhandledRejection", err => {
  console.log(err);
  process.exit(1);
});

runApp();
