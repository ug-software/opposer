import Server from "../../../server/index.js";
import playground from "../../../playground/index.js";

(async () => {
  var app = await Server({
    cors: {
      origin: "*",
    },
  });

  app.opposer.use("/opposer", await playground());

  app.initialize();
})();
