import { ClassType } from "./system.js";

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

export interface RequestHandlerBody {
  method: string;
  paylod: any;
}
