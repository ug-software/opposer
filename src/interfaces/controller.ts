import { ClassType } from "./system.js";
export interface ControllerApiProps {
  handler?: string;
  method: "get" | "insert" | "update" | "delete" | string;
  model: string;
  payload?: any;
}

export interface QueryBuilder {
  [key: string]:
    | string
    | number
    | boolean
    | Date
    | {
        $or?: { [key: string]: any }[];
        $l?: string;
        $il?: string;
        $in?: (string | number | Date)[];
        $nin?: (string | number | Date)[];
        $btw?: [number, number];
        $mt?: number | Date;
        $mte?: number | Date;
        $lt?: number | Date;
        $lte?: number | Date;
        $eq?: any;
      };
}

export interface RelationBuilder {
  model: string;
  select: (string | RelationBuilder)[];
}

export interface HandleGetProps {
  model: string;
  pagination:
    | {
        page: number;
        take: number;
      }
    | undefined;
  query: {
    type: "find" | "filter";
    select: string[];
    find: QueryBuilder;
    filter: QueryBuilder;
    relation: (string | RelationBuilder)[];
  };
}

export interface HandleDeleteProps {
  model: string;
  filter: QueryBuilder;
}

export interface HandleInsertProps {
  model: string;
  data: {
    [key: string]: unknown;
  };
}

export interface HandleUpdateProps {
  model: string;
  filter: QueryBuilder;
  data: {
    [key: string]: unknown;
  };
}

export interface ResultGetAllHandlers {
  [key: string]: {
    metadata: {
      name: string;
    };
    methods: {
      name: string;
    }[];
    handler: ClassType<any>;
  };
}
