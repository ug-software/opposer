import { BaseEntity, FindOptionsSelect } from "typeorm";

export interface ControllerApiProps {
  method: "get" | "insert" | "update" | "delete";
  schema: string;
}

export interface QueryBuilder {
  [key: string]: any;
}

export interface HandleGetProps {
  schema: string;
  pagination:
    | {
        page: number;
        take: number;
      }
    | undefined;
  query: {
    type: "find" | "filter" | "between";
    select: FindOptionsSelect<BaseEntity> | undefined;
    find: {
      [key: string]: unknown;
    };
    filter: {
      [key: string]: unknown;
    };
    between: {
      propertie: string;
      init: any;
      final: any;
    };
    join: [
      {
        schema: string;
        filter: {
          [key: string]: unknown;
        };
      }
    ];
  };
}

export interface HandleDeleteProps {
  schema: string;
  filter: {
    [key: string]: unknown;
  };
}

export interface HandleInsertProps {
  schema: string;
  data: {
    [key: string]: unknown;
  };
}

export interface HandleUpdateProps {
  schema: string;
  filter: {
    [key: string]: unknown;
  };
  data: {
    [key: string]: unknown;
  };
}
