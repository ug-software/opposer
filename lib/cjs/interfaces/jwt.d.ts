export interface ErrorJwt {
    name: string;
    message: string;
    expiredAt: number;
}
export interface SignJwt {
    id: string;
    exp: number;
    fn: string;
    ln: string;
    lg: string;
}
export interface ForgetJwt {
    lg: string;
    ip: string;
    ag: string;
}
