import opposer from "../src/server";

(async () => {
  const app = await opposer({ port: 3000 });

  app.initialize();
})();
