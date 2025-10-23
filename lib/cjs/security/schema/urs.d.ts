import Role from "./rl.js";
export default class User {
    id: string;
    fn: string;
    lm: string;
    em: string;
    ps: string;
    ac: boolean;
    ct: string;
    ut: Date;
    rl: Role[];
}
