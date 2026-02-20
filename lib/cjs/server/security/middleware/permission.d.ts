import { Request, Response, NextFunction } from "express";
declare const _default: (req: Request, res: Response, next: NextFunction) => Promise<void | {
    readonly success: false;
    readonly error: {
        name: string;
        code: number;
        message: any;
    };
} | Response<any, Record<string, any>>>;
export default _default;
