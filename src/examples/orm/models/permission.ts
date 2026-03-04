import { Entity, Field, PrimaryColumn, Relation } from "../../../orm/index.js";
import User from "./user.js";

@Entity("permissions")
export default class Permission {
  @PrimaryColumn({ type: "uuid" })
  id!: string;

  @Field({ type: "string" })
  name!: string;

  @Relation({
    type: "many-to-one",
    target: () => User,
    inverseSide: "permissions"
  })
  user!: User;
}
