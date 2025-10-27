import { HandleRequestResultError } from "../../interfaces/request.js";

export function Success(data: any) {
  return {
    success: true,
    data,
  } as const;
}

export function Exception(error: HandleRequestResultError["error"]) {
  return {
    success: false,
    error: error,
  } as const;
}
