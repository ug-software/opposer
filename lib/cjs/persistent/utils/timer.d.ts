import type { TimerUnit } from "../interfaces/system.js";
declare function getNextSessionExpireDate(): number;
declare function getSeconds(time: number, unit: TimerUnit): number;
declare const _default: {
    getNextSessionExpireDate: typeof getNextSessionExpireDate;
    getSeconds: typeof getSeconds;
    msPerUnit: {
        seconds: number;
        minutes: number;
        hours: number;
        days: number;
    };
};
export default _default;
