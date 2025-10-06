import { HttpStatus } from "../helpers";
import { HandleUpdateProps } from "../interfaces/controller";

export default async (props: HandleUpdateProps) => {
  var schema = schemas.find((x) => x.schema === props.schema);

  if (!schema) {
    return Exception({
      name: HttpStatus[400].name,
      code: HttpStatus[400].code,
      message: "Unabled find schema",
    });
  }

  var repository = db.getRepository(schema.entity);

  //valida se todas as propriedades que existem na data existem no repository
  var repositoryColumns = repository.metadata.columns;
  var thereIsPropertyOutsideTheRule = Object.keys(props.data).map((key) => {
    if (!repositoryColumns.find((x) => x.propertyName == key)) {
      return true;
    }

    return false;
  });

  if (thereIsPropertyOutsideTheRule.includes(true)) {
    return Exception({
      name: HttpStatus[400].name,
      code: HttpStatus[400].code,
      message: "'Data' out of expected range, check your data and try again",
    });
  }

  await repository.update(props.filter, props.data);

  return Success({
    message: "Success updating item",
  });
};
