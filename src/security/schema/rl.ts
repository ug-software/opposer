import { Column, Entity, ManyToOne } from "typeorm";
import Schema from "../../database/schema.js";
import f from "../../database/field.js";
import User from "./urs.js";

@Entity("rl")
export default class Role extends Schema {

  @Column({ type: "varchar" })
  sm = f.object().string("").required("");

  @Column({ type: "varchar" })
  mt = f.object().string("").required("")

  @ManyToOne(() => User, (user) => user.rl)
  usr!: User;
}

/* 
    sm => schema,
    mt => method,
    usr => user
*/
