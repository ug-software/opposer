import Book from "./book.js";
export default class Author {
    id: string;
    firstName: string;
    lastName: string;
    age: number;
    address: {
        number: number;
        street: string;
    };
    books: Book[];
}
