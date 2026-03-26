import Book from "./book.js";
export default class Author {
    id: string;
    name: string;
    nationality?: string;
    books: Book[];
}
