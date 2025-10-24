import { PrimaryGeneratedColumn, Entity, Column, ManyToOne } from "typeorm";
import Author from "./author.js";
import Field from "../../decorators/field.js";
import { f } from "../../database/index.js";

@Entity("book")
export default class Book {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column({ type: "varchar" })
  @Field(() => f().string("").required("Campo de preenchimento obrigatorio"))
  name!: string;

  @Column({ type: "date" })
  @Field(() => f().date("").required("Campo de preenchimento obrigatorio"))
  published!: Date;

  @Column({ type: "varchar" })
  @Field(() => f().string(""))
  description!: string;

  @ManyToOne(() => Author, (author) => author.books)
  author!: Author;
}
