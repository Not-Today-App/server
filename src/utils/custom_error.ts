import { GraphQLError } from "graphql";

export enum AppErrors {
  "EMAIL_ALREADY_EXISTS" = "EMAIL_ALREADY_EXISTS",
  "INVALID_CREDENTIALS" = "INVALID_CREDENTIALS",
  "USER_NOT_FOUND" = "USER_NOT_FOUND",
  "UNAUTHENTICATED" = "UNAUTHENTICATED",
  "UNAUTHORIZED" = "UNAUTHORIZED",
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
