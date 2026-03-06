import {
  Entity,
  Field,
  PrimaryColumn,
  CreateDateColumn,
  f
} from "../../../orm/index.js";

@Entity("ke")
export default class Key {
  @PrimaryColumn({ type: "uuid" })
  id!: string;

  @Field(() => f().string("nm is string.").required("nm is required."))
  nm!: string;

  @Field(() => f().string("hs is string.").required("hs is required."))
  hs!: string;

  @Field(() => f().date("ex is date.").required("ex is required."))
  ex!: Date;

  @CreateDateColumn()
  ct!: Date;
}
