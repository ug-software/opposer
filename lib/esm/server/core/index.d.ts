import http from 'http';
import { type Request, type Response, type NextFunction, OpposerServer as IOpposerServer } from '../../interfaces/server.js';
import { type TransportName } from '../../transports/index.js';
export { Request, Response, NextFunction };
export type Middleware = (req: Request, res: Response, next: NextFunction) => Promise<void> | void;
export declare class OpposerServer implements IOpposerServer {
    private middlewares;
    private settings;
    private enabledTransports;
    constructor();
    use(middleware: Middleware): this;
    configureTransports(enabled: TransportName[]): this;
    private runMiddlewares;
    handleRequest(req: http.IncomingMessage, res: http.ServerResponse): Promise<void>;
    private parseCookies;
    listen(port: number, callback?: () => void): http.Server<typeof http.IncomingMessage, typeof http.ServerResponse>;
}
declare const instance: OpposerServer;
export default instance;
