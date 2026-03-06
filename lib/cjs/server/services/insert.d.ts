import { HandleInsertProps } from "../../interfaces/controller.js";
declare const _default: (props: HandleInsertProps) => Promise<{
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
