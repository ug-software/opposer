import express from "express";
import DatabaseController from "./server/controller/database.js";
import DispatchController from "./server/controller/dispatch.js";
import { CreateServerProps, ServerInstance } from "./interfaces/server.js";
import * as database from "./server/database/index.js";
import * as system from "./system/index.js";

const settings = system.getSettingsFile();

export default async function Server(
  props: CreateServerProps
): Promise<ServerInstance> {
  console.log("-> Initializing database connection.");

  if (!settings.database) {
    throw new Error("-> It is necessary to inform database properties.");
  }
  await database.connect(settings.database);

  console.log("-> Initializing server.");
  const opposer = express();
  let url = "/opposer";

  if (settings.url) {
    url = settings.url;
  }

  // parsing Middleware
  opposer.use(express.json()); // JSON forever active
  if (settings.urlencoded) {
    opposer.use(express.urlencoded({ extended: true }));
  }
  if (settings.text) {
    opposer.use(express.text());
  }

  // Security
  if (settings.helmet) {
    //@ts-ignore
    const helmet = (await import("helmet")).default;
    opposer.use(helmet());
  }

  // CORS
  if (props.cors) {
    //@ts-ignore
    const cors = (await import("cors")).default;
    opposer.use(cors({ ...props.cors }));
  }

  // Rate limit
  if (settings.rateLimit) {
    //@ts-ignore
    const rateLimit = (await import("express-rate-limit")).default;
    opposer.use(
      rateLimit({
        windowMs: settings.rateLimit.windowMs || 15 * 60 * 1000, // 15 minutos por padrão
        max: settings.rateLimit.max || 100, // máximo 100 requests por IP
      })
    );
  }

  // Logging
  if (settings.logger) {
    //@ts-ignore
    const morgan = (await import("morgan")).default;
    opposer.use(morgan("dev"));
  }

  // Routes
  opposer.post(url, DatabaseController);

  // Handlers
  opposer.post("/handler/:handler", DispatchController);

  // Error Middleware
  opposer.use(
    (
      err: any,
      req: express.Request,
      res: express.Response,
      next: express.NextFunction
    ) => {
      console.error(err);
      res
        .status(err.status || 500)
        .json({ message: err.message || "Internal Server Error" });
    }
  );

  function initialize() {
    opposer.listen(settings.port, () => {
      console.log(`⚡Opposer is running in port ${settings.port}`);
    });
  }

  return { opposer, initialize };
}

export * from "./server/database/index.js";
export * from "./server/constants/index.js";
export type { SchemaResult } from "./interfaces/schema.js";
export { Method, Handler, Field } from "./server/decorators/index.js";
