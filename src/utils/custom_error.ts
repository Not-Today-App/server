import { GraphQLError } from "graphql";

export enum AppErrors {
  "REQUIRED_FIELD" = "REQUIRED_FIELD",
  "EMAIL_ALREADY_EXISTS" = "EMAIL_ALREADY_EXISTS",
  "INVALID_CREDENTIALS" = "INVALID_CREDENTIALS",
  "USER_NOT_FOUND" = "USER_NOT_FOUND",
  "UNAUTHENTICATED" = "UNAUTHENTICATED",
  "UNAUTHORIZED" = "UNAUTHORIZED",
  "SAME_DAY_DIARY" = "SAME_DAY_DIARY",
  "DIARY_NOT_FOUND" = "DIARY_NOT_FOUND",
  "INVALID_MOOD" = "INVALID_MOOD",
}

export class AppError extends GraphQLError {
  constructor(message: string, code: AppErrors, input?: any) {
    super(message, {
      extensions: {
        code,
        input,
      },
    });
  }
}
