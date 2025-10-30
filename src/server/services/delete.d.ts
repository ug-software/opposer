import { HandleDeleteProps } from "../../interfaces/controller.js";
declare const _default: (props: HandleDeleteProps) => Promise<{
    readonly success: true;
    readonly data: any;
} | {
    readonly success: false;
    readonly error: {
        name: string;
        code: number;
        message: any;
    };
}>;
export default _default;
