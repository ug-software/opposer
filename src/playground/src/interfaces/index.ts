export interface OpposerMap {
  models: {
    [key: string]: {
      description: string;
      schema: {
        [key: string]: string;
      };
    };
  };
  handlers: {
    [key: string]: {
      [methodName: string]: {
        payload: {
          [key: string]: string;
        };
      };
    };
  };
}
