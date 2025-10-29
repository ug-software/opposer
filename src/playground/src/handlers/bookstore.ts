import { Handler, Method } from "opposer";

@Handler('book-store')
export default class BookStore {
    @Method()
    sincronize() {
        return "Sincronizado."
    }
}