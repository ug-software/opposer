export interface ErrorJwt {
    name: string;
    message: string;
    expiredAt: number;
}
export interface SignJwt {
    usr: string;
    uuid: string;
}
