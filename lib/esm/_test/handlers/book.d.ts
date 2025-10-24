import book from "../schemas/book.js";
export default class Book {
    getLastFiveBooksPublished(): Promise<book[]>;
}
