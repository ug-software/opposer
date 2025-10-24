import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import Book from "./book.js";
import Field from "../../decorators/field.js";
import { f } from "../../database/index.js";

@Entity("author")
export default class Author {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column({ type: "varchar" })
  @Field(() => f().string("").required(""))
  firstName!: string;

  @Column({ type: "varchar" })
  @Field(() => f().string("").required(""))
  lastName!: string;

  @Column({ type: "varchar" })
  @Field(() => f().number("").required(""))
  age!: number;

  @Column({ type: "jsonb" })
  @Field(() =>
    f().json({
      number: f().number(""),
      street: f().string(""),
    })
  )
  address!: {
    number: number;
    street: string;
  };

  @OneToMany(() => Book, (book) => book.author)
  books!: Book[];
}
