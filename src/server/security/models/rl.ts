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

// Keep the relation strongly typed without emitting `design:type = User`.
// Emitting the class here evaluates User during the circular User <-> Role load.
interface RelatedUser extends User {}

@Entity("rl")
export default class Role {
  @PrimaryColumn({ type: "uuid" })
  id!: string;

  @Field(() => f().string("model is string.").required("model is required."))
  sm!: string;

  @Field(() => f().string("model is string.").required("model is required."))
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
  usr!: RelatedUser;
}
