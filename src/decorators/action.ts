import "reflect-metadata";

const ACTIONS_KEY = Symbol("actions");

export default function Action(): MethodDecorator {
  return function (target, name, descriptor) {
    const actions = Reflect.getMetadata(ACTIONS_KEY, target.constructor) || [];

    actions.push({ name });

    Reflect.defineMetadata(ACTIONS_KEY, actions, target.constructor);
  };
}

export function getActionsMetadata(target: Object) {
  return Reflect.getMetadata(ACTIONS_KEY, target) || [];
}
