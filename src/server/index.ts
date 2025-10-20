import express from "express";
import controller from "../controller/index.js";
import { CreateServerProps } from "../interfaces/server.js";
import * as database from "../database/index.js";
import * as system from "../system/index.js";

const settings = system.getSettingsFile();

export default async function Server(props: CreateServerProps) {
  console.log("Inicializando banco de dados...");
  if (!settings.database) {
    throw new Error("Necessário informar as propriedades do Banco de dados...");
  }
  await database.connect(settings.database);

  console.log("Inicializando Servidor...");
  const opposer = express();
  let url = "/opposer";

  if (props.url) {
    url = props.url;
  }

  // Middleware de parsing
  opposer.use(express.json()); // JSON sempre ativo
  if (props.urlencoded) {
    opposer.use(express.urlencoded({ extended: true }));
  }
  if (props.text) {
    opposer.use(express.text());
  }

  // Segurança
  if (props.helmet) {
    //@ts-ignore
    const helmet = (await import("helmet")).default;
    opposer.use(helmet());
  }

  // CORS
  if (props.cors) {
    //@ts-ignore
    const cors = (await import("cors")).default;
    opposer.use(cors({ origin: "*" }));
  }

  // Rate limit
  if (props.rateLimit) {
    //@ts-ignore
    const rateLimit = (await import("express-rate-limit")).default;
    opposer.use(
      rateLimit({
        windowMs: props.rateLimit.windowMs || 15 * 60 * 1000, // 15 minutos por padrão
        max: props.rateLimit.max || 100, // máximo 100 requests por IP
      })
    );
  }

  // Logging
  if (props.logger) {
    //@ts-ignore
    const morgan = (await import("morgan")).default;
    opposer.use(morgan("dev"));
  }

  // Rotas
  opposer.post(url, controller);

  // Middleware de erro
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
    opposer.listen(props.port, () => {
      console.log(`⚡opposer is running in port ${props.port}`);
    });
  }

  return { opposer, initialize };
}
