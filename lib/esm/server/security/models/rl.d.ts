import User from "./usr.js";
interface RelatedUser extends User {
}
export default class Role {
    id: string;
    sm: string;
    mt: string;
    ct: Date;
    ut: Date;
    usr: RelatedUser;
}
export {};
