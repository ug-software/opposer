import { HandleUpdateProps } from "../interfaces/controller.js";
declare const _default: (props: HandleUpdateProps) => Promise<{
    readonly success: true;
    readonly data: any;
} | {
    readonly success: false;
    readonly error: {
        name: string;
        code: number;
        message: string;
    };
}>;
export default _default;
