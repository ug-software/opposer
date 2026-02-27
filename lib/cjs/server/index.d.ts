import { CreateServerProps, ServerInstance } from "../interfaces/server.js";
import Auth from "./security/handler/auth.js";
export default function Server(props: CreateServerProps): Promise<ServerInstance>;
export declare const auth: {
    social: typeof Auth.social;
};
export * from "./database/index.js";
export * from "./constants/index.js";
export * from "./helpers/index.js";
export type { SchemaResult } from "../interfaces/schema.js";
export { Method, Handler, Field, Payload, IsPublic, IsPublicMethod, } from "./decorators/index.js";
export type { PayloadRequest } from "../interfaces/handler.js";
