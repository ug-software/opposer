import { SignJwt } from "../../interfaces/jwt";
export declare function validate(token: string): Promise<string | {
    usr: string;
    uuid: string;
} | undefined>;
export declare function sign({ usr, uuid }: SignJwt): Promise<any>;
export declare function verify(token: string): Promise<string | true | undefined>;
