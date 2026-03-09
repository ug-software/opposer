import {
  f,
  Field,
  Controller,
  Method,
  Payload,
} from "../../../../server/index.js";

class GetAllPerDateDto {
  @Field(() => f().date("typeof is Date").required("date is required"))
  date!: Date;
}

class GetAllBooksPerAuthorDto {
  @Field(() => f().string("typeof is string").required("author is required"))
  author!: string;
}

@Controller("books")
export default class Books {
  @Method()
  getAllBooksPerDate(@Payload(GetAllPerDateDto) filter: GetAllPerDateDto) {
    return [];
  }

  @Method()
  getAllBooksPerAuthor(
    @Payload(GetAllBooksPerAuthorDto) filter: GetAllBooksPerAuthorDto
  ) {}
}
