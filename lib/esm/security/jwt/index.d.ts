import { ForgetJwt, SignJwt } from "../../interfaces/jwt";
declare function access(token: string): Promise<string | SignJwt | undefined>;
declare function refresh(token: string): Promise<string | SignJwt | undefined>;
declare function sign(payload: SignJwt): Promise<{
    token: any;
    refresh: any;
}>;
declare function forget(payload: ForgetJwt): Promise<{
    token: any;
}>;
declare function recover(token: string): Promise<string | ForgetJwt | undefined>;
declare function verify(token: string): Promise<string | true | undefined>;
declare const _default: {
    verify: typeof verify;
    sign: typeof sign;
    forget: typeof forget;
    validate: {
        access: typeof access;
        refresh: typeof refresh;
        recover: typeof recover;
    };
};
export default _default;
