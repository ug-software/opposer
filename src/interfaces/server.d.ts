import http from "http";
export interface CreateServerProps {
    cors?: {
        origin: string;
    };
}
export interface ServerInstance {
    opposer: Express.Application;
    initialize: () => void;
}
export type Server = http.Server<typeof http.IncomingMessage, typeof http.ServerResponse>;
export type HandleCallback = (req: http.IncomingMessage, res: http.ServerResponse) => void;
export type ListinerCallback = () => void;
