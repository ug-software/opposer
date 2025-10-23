import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Field } from "../../decorators/index.js";
import f from "../../database/field.js";
import Role from "./rl.js";
@Entity("urs")
export default class User {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column({ type: "varchar" })
  @Field(() => f().string("").required(""))
  fn!: string;

  @Column({ type: "varchar" })
  @Field(() => f().string("").required(""))
  lm!: string;

  @Column({ type: "varchar" })
  @Field(() => f().string("").required("").match(RegExp(""), ""))
  em!: string;

  @Column({ type: "varchar" })
  @Field(() => f().string("").required(""))
  ps!: string;

  @Column({ type: "boolean", default: true })
  @Field(() => f().boolean(""))
  ac!: boolean;

  @Column({ type: "date", default: new Date() })
  @Field(() => f().date(""))
  ct!: string;

  @Column({ type: "date", default: new Date() })
  @Field(() => f().date(""))
  ut!: Date;

  @OneToMany(() => Role, (role) => role.usr)
  rl!: Role[];
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
