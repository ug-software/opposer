import { Entity, Field, PrimaryColumn, Relation } from "../../../orm/index.js";
import User from "./user.js";

@Entity("profiles")
export default class Profile {
  @PrimaryColumn({ type: "uuid" })
  id!: string;

  @Field({ type: "string" })
  bio!: string;

  @Field({ type: "string" })
  avatarUrl!: string;

  @Relation({
    type: "one-to-one",
    target: () => User,
    inverseSide: "profile"
  })
  user!: User;
}
