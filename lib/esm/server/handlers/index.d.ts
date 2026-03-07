import { ResultGetAllHandlers } from "../../interfaces/controller.js";
import { ClassType } from "../../interfaces/system.js";
export declare function toKebabCase(str: string): string;
export declare function toCamelCase(str: string): string;
export declare function loadHandlers(customHandlers?: string | ClassType<unknown>[]): Promise<ResultGetAllHandlers>;
