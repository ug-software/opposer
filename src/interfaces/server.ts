import http from "http";
import { ClassType } from "./system.js";

export interface CreateServerProps {
  cors?: {
    origin: string | string[];
  };
  models?: string | ClassType<unknown>[];
  handlers?: string | ClassType<unknown>[];
  schedules?: string | ClassType<unknown>[];
}

export interface Request extends http.IncomingMessage {
  server: OpposerServer;
  ip?: string;
  cookies: Record<string, string>;
  body: any;
  url: string;
  method: string;
}

export interface Response extends http.ServerResponse {
  status: (code: number) => Response;
  json: (data: any) => void;
  send: (data: any) => void;
  cookie: (name: string, value: string, options?: any) => void;
  clearCookie: (name: string, options?: any) => void;
}

export type NextFunction = () => void | Promise<void>;

export interface OpposerServer {
  use: (middleware: any) => OpposerServer;
  listen: (port: number, callback?: () => void) => http.Server;
}

export interface ServerInstance {
  opposer: OpposerServer;
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
