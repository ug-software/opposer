import { CreateServerProps, ServerInstance } from '../interfaces/server.js';
import Auth from './security/controller/auth.js';
export default function Server(props: CreateServerProps): Promise<ServerInstance>;
export declare const auth: {
    social: typeof Auth.social;
};
export * from './constants/index.js';
export * from './helpers/index.js';
export type { ModelResult } from '../interfaces/model.js';
export { Method, Controller, Field, Payload, IsPublic, IsPublicMethod, f } from './decorators/index.js';
export type { PayloadRequest } from '../interfaces/controller.js';
export { default as Context } from './context/index.js';
