import Server from "../../server/index.js";
import playground from "../../playground/index.js";

(async () => {
  const app = await Server({
    cors: {
      origin: "*",
    },
  });

  app.opposer.use("/opposer", playground());

  app.initialize();
})();
