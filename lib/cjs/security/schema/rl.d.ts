import Schema from "../../database/schema.js";
import User from "./usr.js";
export default class Role extends Schema {
    sm: string;
    mt: string;
    usr: User;
}
