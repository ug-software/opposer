import http from "http";
export type Request = any;
export type Response = any;
export type NextFunction = () => void | Promise<void>;
export type Middleware = (req: Request, res: Response, next: NextFunction) => Promise<void> | void;
export declare class OpposerServer {
    private middlewares;
    private settings;
    private context;
    constructor();
    use(middleware: Middleware): this;
    setContext(key: string, value: any): void;
    getContext<T>(key: string): T;
    private runMiddlewares;
    handleRequest(req: http.IncomingMessage, res: http.ServerResponse): Promise<void>;
    private parseCookies;
    listen(port: number, callback?: () => void): http.Server<typeof http.IncomingMessage, typeof http.ServerResponse>;
}
declare const _default: OpposerServer;
export default _default;
