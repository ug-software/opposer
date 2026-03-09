export interface OpposerMap {
  models: {
    [key: string]: {
      description: string;
      model: {
        [key: string]: string;
      };
    };
  };
  controllers: {
    [key: string]: {
      [methodName: string]: {
        payload: {
          [key: string]: string;
        };
      };
    };
  };
}
