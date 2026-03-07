declare class GetAllPerDateDto {
    date: Date;
}
declare class GetAllBooksPerAuthorDto {
    author: string;
}
export default class Books {
    getAllBooksPerDate(filter: GetAllPerDateDto): never[];
    getAllBooksPerAuthor(filter: GetAllBooksPerAuthorDto): void;
}
export {};
