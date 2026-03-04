import {
  Entity,
  Field,
  PrimaryColumn,
  CreateDateColumn,
  f
} from "../../../orm/index.js";

@Entity("se")
export default class Session {
  @PrimaryColumn({ type: "uuid" })
  id!: string;

  @Field(() => f().string("usr is string.").required("usr is required."))
  usr!: string;

  @Field(() => f().string("ip is string.").required("ip is required."))
  ip!: string;

  @Field(() => f().string("ag is string.").required("ag is required."))
  ag!: string;

  @Field(() => f().string("rt is string.").required("rt is required."))
  rt!: string;

  @Field(() => f().boolean("ac is boolean.").required("ac is required."))
  ac!: boolean;

  @Field(() => f().date("loi is date.").required("loi is required."))
  loi!: Date;

  @Field(() => f().date("lou is date."))
  lou?: Date;

  @CreateDateColumn()
  ct!: Date;
}
