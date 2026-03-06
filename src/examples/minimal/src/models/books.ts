import { Entity, PrimaryColumn, Field, f } from "../../../../orm/index.js";

@Entity("book")
export default class Books {
  @PrimaryColumn({ generated: true })
  id!: string;

  @Field(() => f().string("type of string").required("field is required"))
  name!: string;
}
