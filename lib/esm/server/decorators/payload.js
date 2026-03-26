const PAYLOAD_KEY = Symbol("method");
export default function Payload(dto) {
    return function (target, name, context) {
        const payloads = Reflect.getMetadata(PAYLOAD_KEY, target.constructor) || [];
        payloads.push({ name, dto });
        Reflect.defineMetadata(PAYLOAD_KEY, payloads, target.constructor);
    };
}
export function getPayloadMetadata(target) {
    return Reflect.getMetadata(PAYLOAD_KEY, target) || [];
}
