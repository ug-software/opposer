import {
  Entity,
  Field,
  PrimaryColumn,
  Relation,
  CreateDateColumn,
  UpdateDateColumn,
  f
} from "../../../orm/index.js";
import User from "./usr.js";

@Entity("rl")
export default class Role {
  @PrimaryColumn({ type: "uuid" })
  id!: string;

  @Field(() => f().string("schema is string.").required("schema is required."))
  sm!: string;

  @Field(() => f().string("method is string.").required("method is required."))
  mt!: string;

  @CreateDateColumn()
  ct!: Date;

  @UpdateDateColumn()
  ut!: Date;

  @Relation({
    type: "many-to-one",
    target: () => User,
    inverseSide: "rl"
  })
  usr!: User;
}
