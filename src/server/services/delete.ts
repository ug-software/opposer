import { HttpStatus } from '../constants/index.js';
import { Exception, Success } from '../helpers/index.js';
import { HandleDeleteProps } from '../../interfaces/controller.js';
import system from '../../system/index.js';
import opposerServer from '../core/index.js';
import { OpposerDatabase } from '../../orm/index.js';
import { ClassType } from '../../interfaces/system.js';
import { Context } from '../index.js';

export default async (props: HandleDeleteProps) => {
  const customModels = Context.get<string | ClassType<unknown>[]>('models');
  const allModels = await system.getAllModels(customModels);
  const schema = allModels.find((x) => x.name === props.model);

  const db = Context.get<OpposerDatabase>('db');

  if (!db) {
    return Exception({
      name: HttpStatus[500].name,
      code: HttpStatus[500].code,
      message: 'Database not connected.',
    });
  }

  if (schema) {
    const repository = db.getRepository(schema.entity);

    if (!props.filter || Object.keys(props.filter).length === 0) {
      return Exception({
        ...HttpStatus[400],
        message: 'Necessary to set query params for delete items.',
      });
    }

    try {
      await repository.delete(props.filter);

      return Success({
        message: 'Success removing item',
      });
    } catch (err: any) {
      return Exception({
        name: HttpStatus[500].name,
        code: HttpStatus[500].code,
        message: err.message,
      });
    }
  }

  return Exception({
    name: HttpStatus[400].name,
    code: HttpStatus[400].code,
    message: 'Unable to identify Schema.',
  });
};
