export interface HandleRequestResultSuccess<R> {
  success: true;
  data: R;
}

export interface HandleRequestResultError {
  success: false;
  error: {
    name: string;
    code: number;
    message: string;
  };
}

export type HandleRequestResult<R> =
  | HandleRequestResultSuccess<R>
  | HandleRequestResultError;
