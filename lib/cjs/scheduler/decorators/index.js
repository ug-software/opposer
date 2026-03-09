"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SCHEDULE_METADATA_KEY = void 0;
exports.Schedule = Schedule;
exports.getScheduleMetadata = getScheduleMetadata;
require("reflect-metadata");
exports.SCHEDULE_METADATA_KEY = Symbol("opposer:schedule");
function Schedule(options) {
    return (target, propertyKey, descriptor) => {
        const schedules = Reflect.getMetadata(exports.SCHEDULE_METADATA_KEY, target.constructor) || [];
        schedules.push({
            ...options,
            propertyKey,
            enabled: options.enabled !== false,
        });
        Reflect.defineMetadata(exports.SCHEDULE_METADATA_KEY, schedules, target.constructor);
    };
}
function getScheduleMetadata(target) {
    return Reflect.getMetadata(exports.SCHEDULE_METADATA_KEY, target) || [];
}
