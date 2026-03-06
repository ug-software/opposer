import "reflect-metadata";

export const SCHEDULE_METADATA_KEY = Symbol("opposer:schedule");

export interface ScheduleOptions {
  name: string;
  interval: number; // Interval in milliseconds
  enabled?: boolean;
}

export function Schedule(options: ScheduleOptions) {
  return (target: any, propertyKey: string, descriptor: PropertyDescriptor) => {
    const schedules = Reflect.getMetadata(SCHEDULE_METADATA_KEY, target.constructor) || [];
    schedules.push({
      ...options,
      propertyKey,
      enabled: options.enabled !== false,
    });
    Reflect.defineMetadata(SCHEDULE_METADATA_KEY, schedules, target.constructor);
  };
}

export function getScheduleMetadata(target: any) {
  return Reflect.getMetadata(SCHEDULE_METADATA_KEY, target) || [];
}
