export interface OpposerMap {
  models: {
    [key: string]: {
      [key: string]: string;
    };
  };
  handlers: {
    [key: string]: {
      payload: {
        [key: string]: string;
      };
    };
  };
}
