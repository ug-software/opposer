import system from "../system/index.js";
const msPerUnit = {
    seconds: 1000,
    minutes: 1000 * 60,
    hours: 1000 * 60 * 60,
    days: 1000 * 60 * 60 * 24,
};
function getNextSessionExpireDate() {
    return (new Date().getTime() +
        system.settings.cache.session.expire *
            msPerUnit[system.settings.cache.session.unit]);
}
function getSeconds(time, unit) {
    return time * msPerUnit[unit];
}
export default { getNextSessionExpireDate, getSeconds, msPerUnit };
