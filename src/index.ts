import createServer from "./server/index.js";
import { Schema, connect, db } from "./database/index.js";
import { HttpStatus, HttpStatusCode, Type } from "./constants/index.js";
import { SchemaResult } from "./interfaces/schema.js";

export const Server = createServer;
export { Schema, connect, db, HttpStatus, HttpStatusCode, Type, SchemaResult };
export default createServer;
