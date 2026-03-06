import { OpposerSystemConfigOptions, ClassType } from "../interfaces/system.js";
export declare class OpposerSystem {
    getFileName(filePath: string, withExtension?: boolean): string;
    getAllModels(): Promise<{
        name: string;
        entity: any;
    }[]>;
    private getAuthModels;
    getAllHandlers(customHandlersPath?: string): Promise<ClassType<any>[]>;
    getSettingsFile(): OpposerSystemConfigOptions;
    getAllFiles(dir: string): string[];
    saveSettingsFile(settings: any): void;
}
declare const system: OpposerSystem;
export default system;
