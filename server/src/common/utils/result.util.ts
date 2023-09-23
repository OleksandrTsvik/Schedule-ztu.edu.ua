export default class Result<T> {
  isSuccess: boolean;
  value?: T;
  error?: string;

  constructor(isSuccess: boolean, value?: T, error?: string) {
    this.isSuccess = isSuccess;
    this.value = value;
    this.error = error;
  }

  static success<T>(value: T): Result<T> {
    return new Result<T>(true, value);
  }

  static failure<T>(error: string): Result<T> {
    return new Result<T>(false, undefined, error);
  }
}
