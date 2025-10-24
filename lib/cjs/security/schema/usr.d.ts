import Role from "./rl.js";
export default class User {
    id: string;
    fn: string;
    ln: string;
    lg: string;
    ps: string;
    ac: boolean;
    ct: string;
    ut: Date;
    rl: Role[];
    hashPassword(): Promise<void>;
    comparePassword(plainPassword: string): Promise<boolean>;
}
