import {
  BeforeInsert,
  BeforeUpdate,
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";
import { Field } from "../../decorators/index.js";
import f from "../../database/field.js";
import bcrypt from "bcrypt";
import Role from "./rl.js";

@Entity("usr")
export default class User {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column({ type: "varchar" })
  @Field(() =>
    f().string("first name is string.").required("first name is required.")
  )
  fn!: string;

  @Column({ type: "varchar" })
  @Field(() =>
    f().string("last name is string.").required("last name is required.")
  )
  ln!: string;

  @Column({ type: "varchar" })
  @Field(() => f().string("ln is string.").required("ln is required."))
  lg!: string;

  @Column({ type: "varchar" })
  @Field(() =>
    f()
      .string("password is string.")
      .required("password is required.")
      .match(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9])[^\s]{8,}$/,
        "password not security, for strong password is necessary upper words, numbers and special characters."
      )
  )
  ps!: string;

  @Column({ type: "boolean", default: true })
  ac!: boolean;

  @CreateDateColumn()
  ct!: Date;

  @UpdateDateColumn()
  ut!: Date;

  @OneToMany(() => Role, (role) => role.usr)
  rl!: Role[];

  @BeforeInsert()
  @BeforeUpdate()
  async hashPassword() {
    if (this.ps) {
      const salt = await bcrypt.genSalt(10);
      this.ps = await bcrypt.hash(this.ps, salt);
    }
  }

  async comparePassword(plainPassword: string): Promise<boolean> {
    return bcrypt.compare(plainPassword, this.ps);
  }
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
