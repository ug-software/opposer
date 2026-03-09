import { Controller, Method } from "opposer";

@Controller('book-store')
export default class BookStore {
    @Method()
    sincronize() {
        return "Sincronizado."
    }
}
