import http from "http";
export interface CreateServerProps {
    port: number;
    url?: string;
    text?: boolean;
    urlencoded?: boolean;
    helmet?: boolean;
    logger?: boolean;
    auth?: boolean;
    cors?: {
        origin: string;
    };
    rateLimit?: {
        windowMs: number;
        max: number;
    };
}
export interface ServerInstance {
    opposer: Express.Application;
    initialize: () => void;
}
export type Server = http.Server<typeof http.IncomingMessage, typeof http.ServerResponse>;
export type HandleCallback = (req: http.IncomingMessage, res: http.ServerResponse) => void;
export type ListinerCallback = () => void;
