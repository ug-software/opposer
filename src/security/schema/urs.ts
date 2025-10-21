import { Column, Entity, OneToMany } from "typeorm";
import Schema from "../../database/schema.js";
import f from "../../database/field.js";
import Role from "./rl.js";

@Entity("urs")
export default class User extends Schema {

  @Column({ type: "varchar" })
  fn = f.object().string("").required("");

  @Column({ type: "varchar" })
  lm = f.object().string("").required("");

  @Column({ type: "varchar" })
  em = f.object().string("").required("").match(RegExp(""), "");

  @Column({ type: "varchar" })
  ps = f.object().string("").required("");
  
  @Column({ type: "boolean", default: true })
  ac = f.object().boolean("");
  
  @Column({ type: "date", default: new Date() })
  ct = f.object().date("");
  
  @Column({ type: "date", default: new Date() })
  ut = f.object().date("");

  @OneToMany(() => Role, (role) => role.usr)
  rl!: Role;
}

/*
    fn => firstName,
    lm => lastName,
    em => e-mail,
    ps => password,
    ac => active,
    ct => created at,
    ut => update at
*/
