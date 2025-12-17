import { CreateServerProps, ServerInstance } from "../interfaces/server.js";
export default function Server(props: CreateServerProps): Promise<ServerInstance>;
export * from "./database/index.js";
export * from "./constants/index.js";
export * from "./helpers/index.js";
export type { SchemaResult } from "../interfaces/schema.js";
export { Method, Handler, Field, Payload } from "./decorators/index.js";
