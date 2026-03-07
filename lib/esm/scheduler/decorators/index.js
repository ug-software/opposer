import "reflect-metadata";
export const SCHEDULE_METADATA_KEY = Symbol("opposer:schedule");
export function Schedule(options) {
    return (target, propertyKey, descriptor) => {
        const schedules = Reflect.getMetadata(SCHEDULE_METADATA_KEY, target.constructor) || [];
        schedules.push({
            ...options,
            propertyKey,
            enabled: options.enabled !== false,
        });
        Reflect.defineMetadata(SCHEDULE_METADATA_KEY, schedules, target.constructor);
    };
}
export function getScheduleMetadata(target) {
    return Reflect.getMetadata(SCHEDULE_METADATA_KEY, target) || [];
}
