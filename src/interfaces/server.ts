import http from "http";
import { ClassType } from "./system.js";
import type { TransportName } from '../transports/types.js';

export interface CreateServerProps {
  /** Response transports enabled by the server. Defaults to ['json', 'stream']. */
  transports?: TransportName[];
  /** Enables the bundled development playground. Defaults to false. */
  playground?: boolean;
  /** Enables schedules and the internal scheduler API. Defaults to true. */
  scheduler?: boolean;
  cors?: {
    origin: string | string[];
    credentials?: boolean;
    methods?: string[];
    allowedHeaders?: string[];
  };
  models?: string | ClassType<unknown>[];
  controllers?: string | ClassType<unknown>[];
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
