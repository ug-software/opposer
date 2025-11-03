import Server from "../../../server/index.js";

(async () => {
  var app = await Server({
    cors: {
      origin: "*",
    },
  });

  app.initialize();
})();
