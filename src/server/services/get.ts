import { HandleGetProps } from '../../interfaces/controller.js';
import { Exception, Success } from '../helpers/index.js';
import { HttpStatus } from '../constants/index.js';
import system from '../../system/index.js';
import { HandleRequestResult } from '../../interfaces/request.js';
import { OpposerDatabase } from '../../orm/index.js';
import { ClassType } from '../../interfaces/system.js';
import { Context } from '../index.js';

export default async (props: HandleGetProps): Promise<HandleRequestResult<unknown>> => {
  const customModels = Context.get<string | ClassType<unknown>[]>('models');
  const allModels = await system.getAllModels(customModels);
  const model = allModels.find((x) => {
    return x.name.toLowerCase() === props.model.toLowerCase();
  });

  if (!model) {
    return Exception({
      name: HttpStatus[400].name,
      code: HttpStatus[400].code,
      message: 'Unable to identify Model.',
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

  if (!props.query) {
    return Exception({
      name: HttpStatus[400].name,
      code: HttpStatus[400].code,
      message: 'Search parameters missing.',
    });
  }

  const repository = db.getRepository(model.entity);

  const queryKeys = ['filter', 'find', 'count', 'exists', 'aggregate', 'distinct', 'group'];
  const presentKeys = queryKeys.filter((k) => {
    return k in props.query;
  });

  if (presentKeys.length > 1) {
    return Exception({
      name: HttpStatus[400].name,
      code: HttpStatus[400].code,
      message: `Conflicting search parameters: multiple types provided (${presentKeys.join(', ')}).`,
    });
  }

  let type = props.query.type;
  if (presentKeys.length === 1) {
    type = presentKeys[0] as any;
  }

  if (!type) {
    return Exception({
      name: HttpStatus[400].name,
      code: HttpStatus[400].code,
      message: 'Search type not identified. Please provide one of: ' + queryKeys.join(', '),
    });
  }

  try {
    switch (type) {
      case 'filter': {
        const filter = props.query.filter || {};
        const select = props.query.select || [];
        const relation = props.query.relation || [];
        const pagination = props.pagination;

        const items = await repository.find({
          where: filter,
          select,
          relation,
          pagination,
        });

        if (props.pagination) {
          const totalItems = await repository.count(filter);
          const totalPages = Math.ceil(totalItems / (props.pagination.take || 10));

          return Success({
            items,
            totalItems,
            totalPages: totalPages > 0 ? totalPages : 0,
          });
        }

        return Success(items);
      }

      case 'find': {
        const find = props.query.find || {};
        const select = props.query.select || [];
        const relation = props.query.relation || [];

        const result = await repository.findOne({
          where: find,
          select,
          relation,
        });

        return Success(result);
      }

      case 'count': {
        const count = props.query.count || {};
        const result = await repository.count(count);
        return Success({ count: result });
      }

      case 'exists': {
        const exists = props.query.exists || {};
        const result = await repository.exists(exists);
        return Success({ exists: result });
      }

      case 'aggregate': {
        const aggregate = props.query.aggregate;
        if (!aggregate) {
          throw new Error('Aggregate configuration missing.');
        }
        const result = await repository.aggregate(aggregate);
        return Success(result);
      }

      case 'distinct': {
        const distinct = props.query.distinct;
        if (!distinct) {
          throw new Error('Distinct configuration missing.');
        }
        const result = await repository.distinct(distinct);
        return Success(result);
      }

      case 'group': {
        const group = props.query.group;
        if (!group) {
          throw new Error('Group configuration missing.');
        }
        const result = await repository.group(group);
        return Success(result);
      }

      default:
        return Exception({
          name: HttpStatus[400].name,
          code: HttpStatus[400].code,
          message: `Search type '${type}' not understood.`,
        });
    }
  } catch (err: any) {
    return Exception({
      name: HttpStatus[400].name,
      code: HttpStatus[400].code,
      message: err.message,
    });
  }
};
