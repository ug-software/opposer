import { PayloadAuthChangePassword, PayloadAuthForgetPassword, PayloadAuthLogin, PayloadAuthRegister } from "../../../interfaces/security.js";
import { PayloadRequest } from "../../../interfaces/handler.js";
export default class Auth {
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
    me(payload: PayloadRequest<string>): Promise<{
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
}
