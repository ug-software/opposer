import Author from "./author.js";
export default class Book {
    id: string;
    name: string;
    published: Date;
    description: string;
    author: Author;
}
