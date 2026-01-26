import { ClassType } from "../../interfaces/system";
export default function Payload<T>(dto: ClassType<T>): (target: Object, name: string, context: any) => void;
export declare function getPayloadMetadata(target: Object): any;
