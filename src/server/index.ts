import express from "express";
import controller from "opposer/src/controller";
import { CreateServerProps } from "opposer/src/interfaces/server";

export default async function (props: CreateServerProps) {
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
  if (props.helmet !== false) {
    // habilitado por padrão, desabilitar passando false
    const helmet = (await import("helmet")).default;
    opposer.use(helmet());
  }

  // CORS
  if (props.cors) {
    const cors = (await import("cors")).default;
    opposer.use(cors({ origin: "*" }));
  }

  // Rate limit
  if (props.rateLimit) {
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
      console.log(`(⚡) opposer is running in port ${props.port}`);
    });
  }

  return { opposer, initialize };
}
