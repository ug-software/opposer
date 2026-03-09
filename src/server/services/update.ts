import { Exception, Success } from '../helpers/index.js';
import { HandleUpdateProps } from '../../interfaces/controller.js';
import { HttpStatus } from '../constants/index.js';
import system from '../../system/index.js';
import { OpposerDatabase } from '../../orm/index.js';
import { ClassType } from '../../interfaces/system.js';
import { Context } from '../index.js';

export default async (props: HandleUpdateProps) => {
  const customModels = Context.get<string | ClassType<unknown>[]>('models');
  const allModels = await system.getAllModels(customModels);
  const model = allModels.find((x) => x.name === props.model);

  if (!model) {
    return Exception({
      name: HttpStatus[400].name,
      code: HttpStatus[400].code,
      message: 'Unable to identify Model',
    });
  }

  const db = Context.get<OpposerDatabase>('db');

  if (!db) {
    return Exception({
      name: HttpStatus[500].name,
      code: HttpStatus[500].code,
      message: 'Database not connected.',
    });
  }

  const repository = db.getRepository(model.entity);

  const repositoryFields = repository.Fields.map((f: any) => f.name);
  const thereIsPropertyOutsideTheRule = Object.keys(props.data).some((key) => {
    return !repositoryFields.includes(key) && key !== 'id';
  });

  if (thereIsPropertyOutsideTheRule) {
    return Exception({
      name: HttpStatus[400].name,
      code: HttpStatus[400].code,
      message: "'Data' out of expected range, check your data and try again",
    });
  }

  if (!props.filter || Object.keys(props.filter).length === 0) {
    return Exception({
      ...HttpStatus[400],
      message: 'Necessary to set query params for update items.',
    });
  }

  try {
    await repository.update(props.filter, props.data);

    return Success({
      message: 'Success updating item',
    });
  } catch (err: any) {
    return Exception({
      name: HttpStatus[500].name,
      code: HttpStatus[500].code,
      message: err.message,
    });
  }
};
