import { HandleInsertProps } from '../../interfaces/controller.js';
import { Exception, Success } from '../helpers/index.js';
import { HttpStatus } from '../constants/index.js';
import system from '../../system/index.js';
import { OpposerDatabase } from '../../orm/index.js';
import { ClassType } from '../../interfaces/system.js';
import { Context } from '../index.js';

export default async (props: HandleInsertProps) => {
  try {
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

    if (typeof props.data !== 'object') {
      return Exception({
        name: HttpStatus[400].name,
        code: HttpStatus[400].code,
        message: "'Data' is not of type 'object'.",
      });
    }

    const repositoryFields = repository.Fields.map((f: any) => f.name);

    const checkDataProperties = (data: any) => {
      return Object.keys(data).every((key) => repositoryFields.includes(key) || key === 'id');
    };

    if (Array.isArray(props.data)) {
      for (const item of props.data) {
        if (!checkDataProperties(item)) {
          return Exception({
            name: HttpStatus[400].name,
            code: HttpStatus[400].code,
            message: 'Some data properties are outside the expected range.',
          });
        }
      }

      const results = await Promise.all(props.data.map((item) => repository.insert(item)));
      return Success(results);
    } else {
      if (!checkDataProperties(props.data)) {
        return Exception({
          name: HttpStatus[400].name,
          code: HttpStatus[400].code,
          message: "'Data' outside of expected range.",
        });
      }

      const result = await repository.insert(props.data);
      return Success(result);
    }
  } catch (err: any) {
    return Exception({
      name: HttpStatus[500].name,
      code: HttpStatus[500].code,
      message: err.message,
    });
  }
};
