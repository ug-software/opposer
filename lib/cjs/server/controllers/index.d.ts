import { ResultGetAllControllers } from "../../interfaces/controller.js";
import { ClassType } from "../../interfaces/system.js";
export declare function toKebabCase(str: string): string;
export declare function toCamelCase(str: string): string;
export declare function loadControllers(customControllers?: string | ClassType<unknown>[]): Promise<ResultGetAllControllers>;
