import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";
import { f, Field } from "../../../../server/index.js";

@Entity("book")
export default class Books {
  @PrimaryGeneratedColumn()
  id!: string;

  @Column({ type: "varchar" })
  @Field(() => f().string("type of string").required("field is required"))
  name!: string;
}
