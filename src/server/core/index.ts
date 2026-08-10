import http from 'http';
import { OpposerSystemConfigOptions } from '../../interfaces/system.js';
import system from '../../system/index.js';
import Context from '../../persistent/context/index.js';
import { type Request, type Response, type NextFunction, OpposerServer as IOpposerServer } from '../../interfaces/server.js';
import { resolveTransport, type TransportName } from '../../transports/index.js';

export { Request, Response, NextFunction };

export type Middleware = (req: Request, res: Response, next: NextFunction) => Promise<void> | void;

export class OpposerServer implements IOpposerServer {
  private middlewares: Middleware[] = [];
  private settings: OpposerSystemConfigOptions;
  private enabledTransports: TransportName[] = ['json', 'stream'];

  constructor() {
    this.settings = system.getSettingsFile();
  }

  use(middleware: Middleware) {
    this.middlewares.push(middleware);
    return this;
  }

  configureTransports(enabled: TransportName[]) {
    if (enabled.length === 0) throw new Error('[server] At least one transport must be enabled.');
    this.enabledTransports = [...new Set(enabled)];
    return this;
  }

  private async runMiddlewares(req: Request, res: Response): Promise<void> {
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
    const extendedReq = req as Request;
    const extendedRes = res as Response;

    await Context.run({ server: this, req: extendedReq, res: extendedRes }, async () => {
      // Inject server instance into request for easy access
      extendedReq.server = this;

      // Request properties
      extendedReq.ip = req.socket.remoteAddress;
      extendedReq.cookies = this.parseCookies(req.headers.cookie || '');

      // Response helpers
      extendedRes.status = (code: number) => {
        extendedRes.statusCode = code;
        return extendedRes;
      };

      extendedRes.json = (data: any) => {
        if (!res.writableEnded) {
          const transport = resolveTransport(extendedReq, this.enabledTransports);
          if (!transport) {
            extendedRes.statusCode = 406;
            res.setHeader('Content-Type', 'application/json; charset=utf-8');
            res.end(JSON.stringify({ message: 'No response transport is available for this request.' }));
            return;
          }
          transport.send(extendedReq, extendedRes, data);
        }
      };

      extendedRes.send = (data: any) => {
        if (!res.writableEnded) {
          if (typeof data === 'object') return extendedRes.json(data);
          extendedRes.end(data);
        }
      };

      extendedRes.cookie = (name: string, value: string, options: any = {}) => {
        let cookieStr = `${name}=${value}`;
        if (options.httpOnly) cookieStr += '; HttpOnly';
        if (options.secure) cookieStr += '; Secure';
        if (options.path) cookieStr += `; Path=${options.path}`;
        if (options.expires) cookieStr += `; Expires=${options.expires.toUTCString()}`;
        if (options.sameSite) cookieStr += `; SameSite=${options.sameSite}`;

        const existing = res.getHeader('Set-Cookie');
        if (!existing) {
          res.setHeader('Set-Cookie', [cookieStr]);
        } else {
          const cookies = Array.isArray(existing) ? existing : [String(existing)];
          cookies.push(cookieStr);
          res.setHeader('Set-Cookie', cookies);
        }
      };

      extendedRes.clearCookie = (name: string, options: any = {}) => {
        extendedRes.cookie(name, '', { ...options, expires: new Date(0) });
      };

      try {
        await this.runMiddlewares(extendedReq, extendedRes);
      } catch (error: any) {
        console.error('[core] Server error:', error);
        if (!res.writableEnded) {
          extendedRes.status(500).json({ message: error.message || 'Internal Server Error' });
        }
      }
    });
  }

  private parseCookies(cookieHeader: string) {
    const cookies: Record<string, string> = {};
    cookieHeader.split(';').forEach((cookie) => {
      const parts = cookie.split('=');
      if (parts.length === 2) {
        cookies[parts[0].trim()] = parts[1].trim();
      }
    });
    return cookies;
  }

  listen(port: number, callback?: () => void) {
    const server = http.createServer((req, res) => this.handleRequest(req, res));
    server.listen(port, callback);
    return server;
  }
}

const instance = new OpposerServer();
export default instance;
