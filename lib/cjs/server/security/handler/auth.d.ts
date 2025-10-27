import { PayloadAuthChangePassword, PayloadAuthForgetPassword, PayloadAuthLogin, PayloadAuthRegister } from "../../../interfaces/security.js";
export default class Auth {
    register(payload: PayloadAuthRegister): Promise<{
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
    login(payload: PayloadAuthLogin): Promise<{
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
    refresh(payload: string): Promise<{
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
    logout(payload: string): Promise<{
        readonly success: false;
        readonly error: {
            name: string;
            code: number;
            message: any;
        };
    } | undefined>;
    me(payload: string): Promise<{
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
    changePassword(payload: PayloadAuthChangePassword): Promise<{
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
    forgotPassword(payload: PayloadAuthForgetPassword): Promise<{
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
