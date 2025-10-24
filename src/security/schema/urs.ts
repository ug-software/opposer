import { Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { Field } from "../../decorators/index.js";
import f from "../../database/field.js";
import Role from "./rl.js";

@Entity("urs")
export default class User {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column({ type: "varchar" })
  @Field(() => f().string("first name is string.").required("first name is required."))
  fn!: string;

  @Column({ type: "varchar" })
  @Field(() => f().string("last name is string.").required("last name is required."))
  lm!: string;

  @Column({ type: "varchar" })
  @Field(() => f().string("e-mail is string.").required("e-mail is required.").match(RegExp(/^[^\s@]+@[^\s@]+\.[^\s@]+$/), "invalid email format."))
  em!: string;

  @Column({ type: "varchar" })
  @Field(() => f().string("password is string.").required("password is required."))
  ps!: string;

  @Column({ type: "boolean", default: true })
  ac!: boolean;

  @CreateDateColumn()
  ct!: string;

  @UpdateDateColumn()
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
