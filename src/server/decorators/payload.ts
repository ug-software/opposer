import { ClassType } from "../../interfaces/system";

const PAYLOAD_KEY = Symbol("method");

export default function Payload<T>(dto: ClassType<T>) {
  return function (target: Object, name: string, context: any) {
    const payloads = Reflect.getMetadata(PAYLOAD_KEY, target.constructor) || [];

    payloads.push({ name, dto });

    Reflect.defineMetadata(PAYLOAD_KEY, payloads, target.constructor);
  };
}

export function getPayloadMetadata(target: Object) {
  return Reflect.getMetadata(PAYLOAD_KEY, target) || [];
}
