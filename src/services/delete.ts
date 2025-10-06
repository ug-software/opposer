import { HttpStatus } from "../helpers";
import { HandleDeleteProps } from "../interfaces/controller";

export default async (props: HandleDeleteProps) => {
  var schema = schemas.find((x) => x.schema === props.schema);

  if (schema) {
    var repository = db.getRepository(schema.entity);

    await repository.delete(props.filter);

    return Success({
      message: "Success remove item",
    });
  }

  return Exception({
    name: HttpStatus[400].name,
    code: HttpStatus[400].code,
    message: "Unable to identify Schema.",
  });
};
