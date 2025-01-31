import { AppError, AppErrors } from "./custom_error.js";

export class Assert {
  static isTrue(
    condition: boolean,
    message: string,
    code: AppErrors,
    input?: any
  ): void {
    if (!condition) {
      throw new AppError(message, code, input);
    }
  }

  static isFalse(
    condition: boolean,
    message: string,
    code: AppErrors,
    input?: any
  ): void {
    if (condition) {
      throw new AppError(message, code, input);
    }
  }
}

/* In simple words, if the assert condition is true then the
program control will execute the next test step but if the condition is
false, the execution will stop and further test step will not be executed. */
