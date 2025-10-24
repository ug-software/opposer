import { db } from "../../database/connect.js";
import Handler from "../../decorators/handler.js";
import Method from "../../decorators/method.js";
import book from "../schemas/book.js";

@Handler("book")
export default class Book {
  @Method()
  async getLastFiveBooksPublished() {
    var bookRepository = db.getRepository(book);

    return await bookRepository.find({
      order: { published: "DESC" },
      take: 5,
    });
  }
}
