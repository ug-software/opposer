import { Entity, Field, PrimaryColumn, Relation, f } from "../../../orm/index.js";
import Author from "./author.js";
import Category from "./category.js";

@Entity("books", { description: "Entity representing a book in the store" })
export default class Book {
  @PrimaryColumn({ type: "uuid" })
  id!: string;

  @Field(() => f().string("Title is string").required("Title is required"))
  title!: string;

  @Field({ type: "number", default: 0 })
  price!: number;

  @Relation({
    type: "many-to-one",
    target: () => Author,
    inverseSide: "books"
  })
  author!: Author;

  @Relation({
    type: "many-to-one",
    target: () => Category,
    inverseSide: "books"
  })
  category!: Category;
}
