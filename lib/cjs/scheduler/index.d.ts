export interface RegisteredTask {
    name: string;
    interval: number;
    propertyKey: string;
    target: any;
    instance: any;
    timer?: NodeJS.Timeout;
}
export declare class Scheduler {
    private tasks;
    private get db();
    initialize(customSchedulesPath?: string): Promise<void>;
    start(): void;
    runTask(name: string, data?: any): Promise<any>;
    getTasks(): {
        name: string;
        interval: number;
        enabled: boolean;
    }[];
}
declare const _default: Scheduler;
export default _default;
