import http from "http";

export interface CreateServerProps {
  cors?: {
    origin: string | string[];
  };
  modelsPath?: string;
  handlersPath?: string;
}

export interface ServerInstance {
  opposer: any;
  initialize: () => void;
}

export type Server = http.Server<
  typeof http.IncomingMessage,
  typeof http.ServerResponse
>;

export type HandleCallback = (
  req: http.IncomingMessage,
  res: http.ServerResponse
) => void;

export type ListinerCallback = () => void;
