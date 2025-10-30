import "reflect-metadata";

// ==========================================
// DECORATORS DE CAMPOS (para os DTOs)
// ==========================================

const dtoRegistry = new Map<string, Record<string, string>>();

function Field(typeFn?: () => any) {
  return function (target: any, propertyKey: string) {
    console.log("Field", { target, propertyKey });

    const className = target.constructor.name;

    console.log("className", className);

    const type = typeFn
      ? typeFn()
      : Reflect.getMetadata("design:type", target, propertyKey);
    const typeName = type ? type.name.toLowerCase() : "any";
    if (!dtoRegistry.has(className)) dtoRegistry.set(className, {});
    dtoRegistry.get(className)![propertyKey] = typeName;
  };
}

// ==========================================
// DECORATORS DE HANDLERS E MÉTODOS
// ==========================================

const handlerRegistry: Record<string, any> = {};

function Handler(name: string) {
  return function (target: any) {
    if (!handlerRegistry.handlers) handlerRegistry.handlers = {};
    handlerRegistry.handlers[name] = {};
    Reflect.defineMetadata("handler:name", name, target.prototype);
  };
}

function Method() {
  return function (target: any, key: string, descriptor: PropertyDescriptor) {
    const handlerName = Reflect.getMetadata("handler:name", target);
    if (!handlerName) throw new Error("Class missing @Handler decorator");
    if (!handlerRegistry.handlers[handlerName])
      handlerRegistry.handlers[handlerName] = {};
    handlerRegistry.handlers[handlerName][key] = {}; // cria entrada do método
  };
}

function Payload() {
  return function (target: any, methodName: string, paramIndex: number) {
    console.log("paylaod", { target, methodName, paramIndex });

    const handlerName = Reflect.getMetadata("handler:name", target);
    const paramTypes = Reflect.getMetadata(
      "design:paramtypes",
      target,
      methodName
    );
    console.log("paramTypes", target);

    const paramType = paramTypes[paramIndex];
    const paramName = paramType.name;

    console.log("paylaod", { paramType, paramName });

    // Captura tipo de payload (recursivo se for DTO)
    const payloadSchema = extractDtoSchema(paramType);

    handlerRegistry.handlers[handlerName][methodName] = {
      payload: {
        name: paramName.charAt(0).toLowerCase() + paramName.slice(1),
        type: payloadSchema,
      },
    };
  };
}

// ==========================================
// FUNÇÃO AUXILIAR PARA EXTRAIR DTOs RECURSIVAMENTE
// ==========================================

function extractDtoSchema(dtoClass: any): any {
  const dtoName = dtoClass.name;
  if (dtoRegistry.has(dtoName)) {
    const schema: Record<string, any> = {};
    const fields = dtoRegistry.get(dtoName)!;
    for (const [key, type] of Object.entries(fields)) {
      // se for outro DTO conhecido, desce recursivamente
      const inner = [...dtoRegistry.keys()].find(
        (k) => k.toLowerCase() === type
      );
      if (inner) schema[key] = extractDtoSchema(eval(inner));
      else schema[key] = type;
    }
    return schema;
  } else {
    return dtoName.toLowerCase();
  }
}

// ==========================================
// EXEMPLO DE USO
// ==========================================

class Book {
  @Field()
  name!: string;

  @Field()
  author!: string;
}

class Books {
  getAllPerDate(@Payload() date: Date) {}

  insertBook(@Payload() book: Book) {}
}

// ==========================================
// RESULTADO FINAL
// ==========================================

console.log(JSON.stringify(handlerRegistry, null, 2));
