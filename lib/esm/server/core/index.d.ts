import http from 'http';
import { Request, Response, NextFunction, OpposerServer as IOpposerServer } from '../../interfaces/server.js';
export { Request, Response, NextFunction };
export type Middleware = (req: Request, res: Response, next: NextFunction) => Promise<void> | void;
export declare class OpposerServer implements IOpposerServer {
    private middlewares;
    private settings;
    constructor();
    use(middleware: Middleware): this;
    private runMiddlewares;
    handleRequest(req: http.IncomingMessage, res: http.ServerResponse): Promise<void>;
    private parseCookies;
    listen(port: number, callback?: () => void): http.Server<typeof http.IncomingMessage, typeof http.ServerResponse>;
}
declare const instance: OpposerServer;
export default instance;
