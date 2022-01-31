import { init } from "./server";

const runApp = async () => {
  const server = await init();

  await server.start();
  console.log(`Server running at: ${server.info.uri}`);
};

process.on("unhandledRejection", err => {
  console.log(err);
  process.exit(1);
});

runApp();
