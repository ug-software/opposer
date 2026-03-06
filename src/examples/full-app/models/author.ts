import { Entity, Field, PrimaryColumn, Relation, f } from "../../../orm/index.js";
import Book from "./book.js";

@Entity("authors", { description: "The author of the book, which contains the name and nationality" })
export default class Author {
  @PrimaryColumn({ type: "uuid" })
  id!: string;

  @Field(() => f().string("Name is string").required("Name is required"))
  name!: string;

  @Field({ type: "string" })
  nationality?: string;

  @Relation({
    type: "one-to-many",
    target: () => Book,
    inverseSide: "author"
  })
  books!: Book[];
}
