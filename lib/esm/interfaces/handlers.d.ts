import { ClassType } from "./system.js";
export interface ResultGetAllHandlers {
    [key: string]: {
        metadata: {
            name: string;
        };
        actions: {
            name: string;
        }[];
        handler: ClassType<any>;
    };
}
export interface RequestHandlerBody {
    action: string;
    paylod: any;
}
