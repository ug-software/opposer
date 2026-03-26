import Server from "../../../server/index.js";

(async () => {
  var app = await Server({
    cors: {
      origin: "*",
      //credentials: true,
      //methods: ["POST", "OPTIONS"],
      //allowedHeaders: ["Content-Type", "opposer-key", "Authorization"]
    },
  });

  app.initialize();
})();
