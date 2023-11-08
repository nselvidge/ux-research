import { result } from "lodash";
import { isNot } from "remeda";

export class Success<T> {
  ok = true;
  constructor(public value: T) {}
}

export const success = <T>(value: T) => new Success(value);

export class Failure<E = Error> {
  ok = false;
  constructor(public error: E) {}
}

export const failure = <E>(error: E) => new Failure(error);

export type Result<T, E = Error> = Success<T> | Failure<E>;

export const isSuccess = <T, E>(result: Result<T, E>): result is Success<T> =>
  result.ok;

export const isFailure = <E>(result: Result<any, E>): result is Failure<E> =>
  result.ok === false && (result as any).error;

export const isResult = <T, E>(result: any): result is Result<T, E> =>
  isSuccess(result) || isFailure(result);

export const unwrap = <T, E>(result: Result<T, E>) => {
  if (!isSuccess(result)) {
    throw result.error;
  }
  return result.value;
};

export const withValue =
  <T, R, E = Error, RE = Error>(fn: (value: T) => Result<R, RE> | R) =>
  (result: Result<T, E>) => {
    if (isSuccess(result)) {
      const newResult = fn(result.value);
      if (isResult(newResult)) {
        return newResult;
      }
      return success(newResult);
    }
    return result;
  };
