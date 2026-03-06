import {
  Entity,
  Field,
  PrimaryColumn,
  Relation,
  CreateDateColumn,
  UpdateDateColumn,
  BeforeInsert,
  BeforeUpdate,
  f,
} from "../../../orm/index.js";
import bcrypt from "bcrypt";
import Role from "./rl.js";

@Entity("usr")
export default class User {
  @PrimaryColumn({ type: "uuid" })
  id!: string;

  @Field(() =>
    f().string("first name is string.").required("first name is required.")
  )
  fn!: string;

  @Field(() =>
    f().string("last name is string.").required("last name is required.")
  )
  ln!: string;

  @Field(() => f().string("ln is string.").required("ln is required."))
  lg!: string;

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

  @Field({ type: "boolean", default: true })
  ac!: boolean;

  @CreateDateColumn()
  ct!: Date;

  @UpdateDateColumn()
  ut!: Date;

  @Relation({
    type: "one-to-many",
    target: () => Role,
    inverseSide: "usr",
  })
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
    return await bcrypt.compare(plainPassword, this.ps);
  }
}
