import { OpposerSystemConfigOptions, ClassType } from "../interfaces/system.js";
export declare function getFileName(filePath: string, withExtension?: boolean): string;
export declare function getAllSchemas(): Promise<{
    name: string;
    entity: any;
}[]>;
export declare function getAllHandlers(): Promise<ClassType<any>[]>;
export declare function getSettingsFile(): OpposerSystemConfigOptions;
