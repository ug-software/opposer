import http from "http";
import { OpposerSystemConfigOptions } from "../../interfaces/system.js";
import system from "../../system/index.js";
import Context from "../../persistent/context/index.js";

export type Request = any;
export type Response = any;
export type NextFunction = () => void | Promise<void>;

export type Middleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => Promise<void> | void;

export class OpposerServer {
  private middlewares: Middleware[] = [];
  private settings: OpposerSystemConfigOptions;
  private context: Map<string, any> = new Map();

  constructor() {
    this.settings = system.getSettingsFile();
  }

  use(middleware: Middleware) {
    this.middlewares.push(middleware);
    return this;
  }

  setContext(key: string, value: any) {
    this.context.set(key, value);
  }

  getContext<T>(key: string): T {
    return this.context.get(key);
  }

  private async runMiddlewares(req: any, res: any): Promise<void> {
    let index = 0;
    const next = async () => {
      if (index < this.middlewares.length) {
        const middleware = this.middlewares[index++];
        await middleware(req, res, next);
      }
    };
    await next();
  }

  async handleRequest(req: http.IncomingMessage, res: http.ServerResponse) {
    const extendedReq = req as any;
    const extendedRes = res as any;

    await Context.run({ server: this, req: extendedReq, res: extendedRes }, async () => {
      // Inject server instance into request for easy access
      extendedReq.server = this;

      // Request properties
      extendedReq.ip = req.socket.remoteAddress;
      extendedReq.cookies = this.parseCookies(req.headers.cookie || "");

      // Response helpers
      extendedRes.status = (code: number) => {
        extendedRes.statusCode = code;
        return extendedRes;
      };

      extendedRes.json = (data: any) => {
        if (!res.writableEnded) {
          extendedRes.setHeader("Content-Type", "application/json");
          extendedRes.end(JSON.stringify(data));
        }
      };

      extendedRes.send = (data: any) => {
        if (!res.writableEnded) {
          if (typeof data === "object") return extendedRes.json(data);
          extendedRes.end(data);
        }
      };

      extendedRes.cookie = (name: string, value: string, options: any = {}) => {
        let cookieStr = `${name}=${value}`;
        if (options.httpOnly) cookieStr += "; HttpOnly";
        if (options.secure) cookieStr += "; Secure";
        if (options.path) cookieStr += `; Path=${options.path}`;
        if (options.expires)
          cookieStr += `; Expires=${options.expires.toUTCString()}`;
        if (options.sameSite) cookieStr += `; SameSite=${options.sameSite}`;

        const existing = res.getHeader("Set-Cookie");
        if (!existing) {
          res.setHeader("Set-Cookie", [cookieStr]);
        } else {
          const cookies = Array.isArray(existing) ? existing : [String(existing)];
          cookies.push(cookieStr);
          res.setHeader("Set-Cookie", cookies);
        }
      };

      extendedRes.clearCookie = (name: string, options: any = {}) => {
        extendedRes.cookie(name, "", { ...options, expires: new Date(0) });
      };

      try {
        await this.runMiddlewares(extendedReq, extendedRes);
      } catch (error: any) {
        console.error("[core] Server error:", error);
        if (!res.writableEnded) {
          extendedRes
            .status(500)
            .json({ message: error.message || "Internal Server Error" });
        }
      }
    });
  }

  private parseCookies(cookieHeader: string) {
    const cookies: any = {};
    cookieHeader.split(";").forEach((cookie) => {
      const parts = cookie.split("=");
      if (parts.length === 2) {
        cookies[parts[0].trim()] = parts[1].trim();
      }
    });
    return cookies;
  }

  listen(port: number, callback?: () => void) {
    const server = http.createServer((req, res) =>
      this.handleRequest(req, res)
    );
    server.listen(port, callback);
    return server;
  }
}

export default new OpposerServer();
