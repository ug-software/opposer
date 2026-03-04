import { Entity, Field, PrimaryColumn, f } from "../../../orm/index.js";

@Entity("categories")
export default class Category {
  @PrimaryColumn({ type: "uuid" })
  id!: string;

  @Field(() => f().string("Title is string").required("Title is required"))
  title!: string;
}
