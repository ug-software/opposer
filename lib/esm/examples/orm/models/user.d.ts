import Profile from "./profile.js";
import Permission from "./permission.js";
export default class User {
    id: string;
    name: string;
    email: string;
    age: number;
    createdAt: Date;
    profile?: Profile;
    permissions?: Permission[];
}
