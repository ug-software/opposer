import { ClassType } from "./system.js";

export interface ResultGetAllReducers {
  [key: string]: {
    reducer: {
      name: string;
    };
    actions: {
      name: string;
    }[];
    handler: ClassType<any>;
  };
}

export interface RequestReducerBody {
  action: string;
  paylod: any;
}
