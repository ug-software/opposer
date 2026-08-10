import { OpposerSystemConfigOptions, ClassType, ModelDefinition } from '../interfaces/system.js';
export declare class OpposerSystem {
    private features;
    configureFeatures(features: Partial<{
        scheduler: boolean;
    }>): void;
    getFileName(filePath: string, withExtension?: boolean): string;
    getAllModels(customModels?: string | ClassType<unknown>[]): Promise<ModelDefinition[]>;
    private getAuthModels;
    getAllControllers(customControllers?: string | ClassType<unknown>[]): Promise<ClassType<unknown>[]>;
    getAllSchedules(customSchedules?: string | ClassType<unknown>[]): Promise<ClassType<unknown>[]>;
    getSettingsFile(): OpposerSystemConfigOptions;
    getAllFiles(dir: string): string[];
    saveSettingsFile(settings: OpposerSystemConfigOptions): void;
    getAllDefaultFromDir(dir: string): Promise<any[]>;
}
declare const system: OpposerSystem;
export default system;
