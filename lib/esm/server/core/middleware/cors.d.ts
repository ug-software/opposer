import { Middleware } from "../index.js";
export default function cors(options?: {
    origin: string | string[];
}): Middleware;
