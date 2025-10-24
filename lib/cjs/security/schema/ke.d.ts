import Schema from "../../database/schema.js";
export default class Key extends Schema {
    hs: string;
    ct: Date;
    ex: Date;
}
