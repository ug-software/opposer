import Author from "./author.js";
import Category from "./category.js";
export default class Book {
    id: string;
    title: string;
    price: number;
    author: Author;
    category: Category;
}
