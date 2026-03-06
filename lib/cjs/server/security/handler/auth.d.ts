import { PayloadAuthChangePassword, PayloadAuthForgetPassword, PayloadAuthLogin, PayloadAuthRegister, PayloadSocialLogin } from "../../../interfaces/security.js";
import { PayloadRequest } from "../../../interfaces/handler.js";
export default class Auth {
    private get db();
    register(payload: PayloadRequest<PayloadAuthRegister>): Promise<{
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
    login(payload: PayloadRequest<PayloadAuthLogin>): Promise<{
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
    refresh(payload: PayloadRequest<string>): Promise<{
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
    logout(payload: PayloadRequest<string>): Promise<{
        readonly success: false;
        readonly error: {
            name: string;
            code: number;
            message: any;
        };
    } | undefined>;
    me(payload: PayloadRequest<any>): Promise<{
        readonly success: true;
        readonly data: any;
    } | null>;
    changePassword(payload: PayloadRequest<PayloadAuthChangePassword>): Promise<{
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
    forgotPassword(payload: PayloadRequest<PayloadAuthForgetPassword>): Promise<{
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
    static social(payload: PayloadRequest<PayloadSocialLogin>): Promise<{
        readonly success: true;
        readonly data: any;
    }>;
}
