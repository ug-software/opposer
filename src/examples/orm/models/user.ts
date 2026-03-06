import { Entity, Field, PrimaryColumn, Relation, f } from "../../../orm/index.js";
import Profile from "./profile.js";
import Permission from "./permission.js";

@Entity("users")
export default class User {
  @PrimaryColumn({ type: "uuid" })
  id!: string;

  @Field({
    type: "string",
    validation: () => f().string("Name must be a string").required("Name is required")
  })
  name!: string;

  @Field({
    type: "string",
    validation: () => f().string("Email must be a string").required("Email is required").match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/, "Invalid email format")
  })
  email!: string;

  @Field({
    type: "number",
    default: 18,
    validation: () => f().number("Age must be a number").min(18, "Must be at least 18 years old")
  })
  age!: number;

  @Field({ type: "date", default: new Date() })
  createdAt!: Date;

  // 1:1 Relationship
  @Relation({
    type: "one-to-one",
    target: () => Profile,
    inverseSide: "user",
    joinColumn: true
  })
  profile?: Profile;

  // 1:N Relationship
  @Relation({
    type: "one-to-many",
    target: () => Permission,
    inverseSide: "user"
  })
  permissions?: Permission[];
}
