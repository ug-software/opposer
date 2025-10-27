import { HandleRequestResultError } from "../../interfaces/request.js";
export declare function Success(data: any): {
    readonly success: true;
    readonly data: any;
};
export declare function Exception(error: HandleRequestResultError["error"]): {
    readonly success: false;
    readonly error: {
        name: string;
        code: number;
        message: any;
    };
};
