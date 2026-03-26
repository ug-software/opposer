export interface PayloadAuthRegister {
    fn: string;
    ln: string;
    lg: string;
    ps: string;
}
export interface PayloadSocialLogin {
    id: string;
    fn: string;
    ln: string;
    lg: string;
    rl: {
        sm: string;
        mt: string;
    }[];
}
export interface PayloadAuthLogin {
    lg: string;
    ps: string;
    ip: string;
    ag: string;
}
export interface PayloadAuthForgetPassword {
    lg: string;
    ip: string;
    ag: string;
}
export interface PayloadAuthChangePassword {
    tk: string;
    ps: string;
    rw: string;
}
