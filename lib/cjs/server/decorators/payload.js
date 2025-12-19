"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = Payload;
exports.getPayloadMetadata = getPayloadMetadata;
const PAYLOAD_KEY = Symbol("method");
function Payload(dto) {
    return function (target, name, context) {
        const payloads = Reflect.getMetadata(PAYLOAD_KEY, target.constructor) || [];
        payloads.push({ name, dto });
        Reflect.defineMetadata(PAYLOAD_KEY, payloads, target.constructor);
    };
}
function getPayloadMetadata(target) {
    return Reflect.getMetadata(PAYLOAD_KEY, target) || [];
}
