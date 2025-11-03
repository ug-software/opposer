import "reflect-metadata";

import {
  Field,
  Payload,
  Method,
  Handler,
} from "../../../server/decorators/index.js";
import { f } from "../../../server/database/index.js";

class InsertBookDto {
  @Field(f().string("Campo é do tipo string").required("Campo é obrigatorio"))
  name!: string;
}

class GetAllPerDateDto {
  @Field(f().date("Campo é do tipo Date").required("Campo é obrigatorio"))
  date!: Date;
}

@Handler("books")
class Books {
  @Method()
  getAllPerDate(@Payload(GetAllPerDateDto) getPerDate: GetAllPerDateDto) {}

  @Method()
  insertBook(@Payload(InsertBookDto) book: InsertBookDto) {}
}
