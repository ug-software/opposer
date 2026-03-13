import type { Request, Response } from '../interfaces/server.js';
export default function Playground(req: Request, res: Response, next: () => void): Promise<void>;
