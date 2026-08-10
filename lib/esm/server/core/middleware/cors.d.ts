import { Middleware } from "../index.js";
export default function cors(options?: {
    origin: string | string[];
    credentials?: boolean;
    methods?: string[];
    allowedHeaders?: string[];
}): Middleware;
