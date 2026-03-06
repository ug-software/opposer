import "reflect-metadata";
export declare const SCHEDULE_METADATA_KEY: unique symbol;
export interface ScheduleOptions {
    name: string;
    interval: number;
    enabled?: boolean;
}
export declare function Schedule(options: ScheduleOptions): (target: any, propertyKey: string, descriptor: PropertyDescriptor) => void;
export declare function getScheduleMetadata(target: any): any;
