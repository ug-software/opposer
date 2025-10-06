import { TypeORMError } from "typeorm";
import { HandleInsertProps } from "../interfaces/controller";
import { HttpStatus } from "../helpers";

export default async (props: HandleInsertProps) => {
  try {
    var schema = schemas.find((x) => x.schema === props.schema);

    if (!schema) {
      return Exception({
        name: HttpStatus[400].name,
        code: HttpStatus[400].code,
        message: "Unable to identify Schema",
      });
    }
    var repository = db.getRepository(schema.entity);

    if (typeof props.data !== "object") {
      return Exception({
        name: HttpStatus[400].name,
        code: HttpStatus[400].code,
        message: "'Data' is not of type 'object'.",
      });
    }

    //valida se todas as propriedades que existem na data existem no repository
    var repositoryColumns = [
      ...repository.metadata.columns,
      ...repository.metadata.relations,
    ];

    var thereIsPropertyOutsideTheRule = Object.keys(props.data).map((key) => {
      if (
        !repositoryColumns.find(
          (x) => x.propertyName == key && x.propertyName !== "id"
        )
      ) {
        return true;
      }

      return false;
    });

    if (thereIsPropertyOutsideTheRule.includes(true)) {
      return Exception({
        name: HttpStatus[400].name,
        code: HttpStatus[400].code,
        message:
          "'Data' outside of expected range, check your data and try again.",
      });
    }

    const item = await repository.create(props.data).save();

    return Success({
      item,
    });
  } catch (err) {
    var error = err as TypeORMError;
    return Exception({
      name: HttpStatus[500].name,
      code: HttpStatus[500].code,
      message: error.message,
    });
  }
};
